// apps/http-server/src/game/controller.ts
import { Request, Response } from 'express';
import { redis } from '@repo/backend-common/redis';
import prisma from '@repo/db/client';
import { successResponse } from '@repo/backend-common/response';
import { ApiError } from '@repo/backend-common/errors';

// What gets stored in Redis queue (sorted set)
// Key:   queue:BLITZ  (one queue per time control type)
// Value: userId
// Score: Date.now()   (so we can match by wait time)

const TIME_CONTROL_CONFIG = {
  BULLET: { initialTimeMs: 60_000, incrementMs: 0 },
  BLITZ: { initialTimeMs: 300_000, incrementMs: 0 },
  RAPID: { initialTimeMs: 600_000, incrementMs: 5000 },
  CLASSICAL: { initialTimeMs: 1800_000, incrementMs: 30000 },
};

export const joinQueue = async (req: Request, res: Response) => {
  const userId = req.user!.id!; // set by your JWT middleware
  console.log(req.user!.id!);
  const { timeControlType } = req.body; // "BLITZ" | "BULLET" etc.

  const queueKey = `queue:${timeControlType}`;

  // ── 1. Check if this user is already in queue ──────────────────────────
  const alreadyInQueue = await redis.zscore(queueKey, userId);
  if (alreadyInQueue !== null) {
    throw new ApiError(400, 'You are already in the queue');
  }

  // ── 2. Check if there is a waiting player ──────────────────────────────
  // ZPOPMIN returns the member with the LOWEST score (waited longest)
  // Returns: ["userId", "timestamp"] or [] if queue is empty
  const waiting = await redis.zpopmin(queueKey, 1);

  if (waiting.length === 0) {
    // ── 2a. No one waiting → join the queue ──────────────────────────────
    await redis.zadd(queueKey, Date.now(), userId);

    // Also update user status in DB (optional but nice for presence)
    // await prisma?.default.user.update({
    //   where: { id: userId },
    //   data: { status: "ONLINE" },  // not IN_GAME yet, still searching
    // });

    return res
      .status(200)
      .json(successResponse('Joined queue, waiting for opponent', { status: 'WAITING' }));
  }

  // ── 3. Opponent found → create the game ────────────────────────────────
  const opponentId = waiting[0]; // waiting = ["opponentId", "score"]

  // Random color assignment
  const [whiteId, blackId] = Math.random() > 0.5 ? [userId, opponentId] : [opponentId, userId];

  const config = TIME_CONTROL_CONFIG[timeControlType as keyof typeof TIME_CONTROL_CONFIG];

  // ── 4. Persist game to Postgres ─────────────────────────────────────────
  const game = await prisma?.default.game.create({
    data: {
      status: 'ACTIVE',
      timeControlType,
      initialTimeMs: config.initialTimeMs,
      incrementMs: config.incrementMs,
      currentFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      startedAt: new Date(),
      turn: 'WHITE',
      participants: {
        create: [
          {
            userId: whiteId as string,
            color: 'WHITE',
            remainingTimeMs: config.initialTimeMs,
          },
          {
            userId: blackId as string,
            color: 'BLACK',
            remainingTimeMs: config.initialTimeMs,
          },
        ],
      },
    },
    include: { participants: true },
  });

  // ── 5. Store live game state in Redis ───────────────────────────────────
  // This is what the WS server will read on every move
  // Redis Hash: field → value (all strings)
  await redis.hset(`game:${game.id}`, {
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    turn: 'WHITE',
    status: 'ACTIVE',
    whiteId,
    blackId,
    whiteMs: String(config.initialTimeMs),
    blackMs: String(config.initialTimeMs),
    incrementMs: String(config.incrementMs),
    moveCount: '0',
    lastMoveAt: String(Date.now()),
  });

  // Auto-delete this Redis key after 2 hours (abandoned game cleanup)
  await redis.expire(`game:${game.id}`, 7200);

  // ── 6. Store socket routing: userId → gameId ────────────────────────────
  // WS server needs to know which game a user belongs to when they connect
  await redis.set(`user:game:${whiteId}`, game.id, 'EX', 7200);
  await redis.set(`user:game:${blackId}`, game.id, 'EX', 7200);

  // ── 7. Update both users' status in DB ─────────────────────────────────
  await prisma?.default.user.updateMany({
    where: { id: { in: [whiteId as string, blackId as string] } },
    data: { status: 'IN_GAME' },
  });

  // ── 8. Notify WS server via Redis Pub/Sub ──────────────────────────────
  // WS server is subscribed to "game:ready" channel
  // It will emit GAME_STARTED to both players' sockets
  await redis.publish(
    'game:ready',
    JSON.stringify({
      gameId: game.id,
      whiteId: whiteId as string,
      blackId: blackId as string,
      timeControlType,
      initialTimeMs: config.initialTimeMs,
      incrementMs: config.incrementMs,
    })
  );

  return res
    .status(200)
    .json(
      successResponse('Game started!', {
        status: 'MATCHED',
        gameId: game.id,
        color: userId === whiteId ? 'WHITE' : 'BLACK',
      })
    );
};

export const leaveQueue = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { timeControlType } = req.body;

  await redis.zrem(`queue:${timeControlType}`, userId);

  return res.status(200).json(successResponse('Left queue', null));
};
