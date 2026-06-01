import { Server, Socket } from 'socket.io';

import { rooms } from '../managers/roomManager';

interface MoveData {
  roomId: string;

  move: {
    from: string;
    to: string;
    promotion?: string;
  };
}

const handleMove = (io: Server, socket: Socket, data: MoveData) => {
  const { roomId, move } = data;

  const room = rooms[roomId];

  if (!room) {
    return;
  }

  const game = room.game;

  try {
    const result = game.move(move);

    // Invalid move
    if (!result) {
      socket.emit('invalid-move');

      return;
    }

    // Send move to opponent
    socket.to(roomId).emit('move', move);

    // Send board state
    io.to(roomId).emit('board-state', game.fen());

    // Game over
    if (game.isGameOver()) {
      io.to(roomId).emit('game-over', {
        reason: getGameOverReason(game),
      });

      delete rooms[roomId];
    }
  } catch (error) {
    socket.emit('invalid-move');
  }
};

const getGameOverReason = (game: any) => {
  if (game.isCheckmate()) {
    return 'checkmate';
  }

  if (game.isDraw()) {
    return 'draw';
  }

  if (game.isStalemate()) {
    return 'stalemate';
  }

  return 'game over';
};

export default handleMove;
