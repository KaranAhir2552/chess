/*
  Warnings:

  - You are about to drop the column `blackUserId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `whiteUserId` on the `Game` table. All the data in the column will be lost.
  - The `status` column on the `Game` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `result` column on the `Game` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `from` on the `Move` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `Move` table. All the data in the column will be lost.
  - You are about to drop the `Indexes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[gameId,moveNumber]` on the table `Move` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `initialTimeMs` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeControlType` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color` to the `Move` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromSquare` to the `Move` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toSquare` to the `Move` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Color" AS ENUM ('WHITE', 'BLACK');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('OFFLINE', 'ONLINE', 'IN_GAME');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('WAITING', 'ACTIVE', 'FINISHED', 'ABORTED');

-- CreateEnum
CREATE TYPE "GameResult" AS ENUM ('WHITE_WIN', 'BLACK_WIN', 'DRAW');

-- CreateEnum
CREATE TYPE "FriendRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TimeControlType" AS ENUM ('BULLET', 'BLITZ', 'RAPID', 'CLASSICAL', 'CUSTOM');

-- CreateEnum
CREATE TYPE "GameEventType" AS ENUM ('GAME_CREATED', 'GAME_STARTED', 'MOVE_MADE', 'DRAW_OFFERED', 'DRAW_ACCEPTED', 'RESIGNED', 'TIMEOUT', 'ABORTED', 'GAME_FINISHED');

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "blackUserId",
DROP COLUMN "whiteUserId",
ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "incrementMs" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "initialTimeMs" INTEGER NOT NULL,
ADD COLUMN     "pgn" TEXT,
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "timeControlType" "TimeControlType" NOT NULL,
ADD COLUMN     "turn" "Color" NOT NULL DEFAULT 'WHITE',
DROP COLUMN "status",
ADD COLUMN     "status" "GameStatus" NOT NULL DEFAULT 'WAITING',
DROP COLUMN "result",
ADD COLUMN     "result" "GameResult";

-- AlterTable
ALTER TABLE "Move" DROP COLUMN "from",
DROP COLUMN "to",
ADD COLUMN     "color" "Color" NOT NULL,
ADD COLUMN     "fromSquare" TEXT NOT NULL,
ADD COLUMN     "timeSpentMs" INTEGER,
ADD COLUMN     "toSquare" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 1200,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'OFFLINE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "Indexes";

-- CreateTable
CREATE TABLE "GameParticipant" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "color" "Color" NOT NULL,
    "remainingTimeMs" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FriendRequest" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" "FriendRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "id" TEXT NOT NULL,
    "user1Id" TEXT NOT NULL,
    "user2Id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchmakingQueue" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timeControlType" "TimeControlType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchmakingQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameMessage" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameEvent" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "type" "GameEventType" NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GameParticipant_userId_idx" ON "GameParticipant"("userId");

-- CreateIndex
CREATE INDEX "GameParticipant_gameId_idx" ON "GameParticipant"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "GameParticipant_gameId_color_key" ON "GameParticipant"("gameId", "color");

-- CreateIndex
CREATE UNIQUE INDEX "GameParticipant_gameId_userId_key" ON "GameParticipant"("gameId", "userId");

-- CreateIndex
CREATE INDEX "FriendRequest_receiverId_idx" ON "FriendRequest"("receiverId");

-- CreateIndex
CREATE INDEX "FriendRequest_status_idx" ON "FriendRequest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_senderId_receiverId_key" ON "FriendRequest"("senderId", "receiverId");

-- CreateIndex
CREATE INDEX "Friendship_user1Id_idx" ON "Friendship"("user1Id");

-- CreateIndex
CREATE INDEX "Friendship_user2Id_idx" ON "Friendship"("user2Id");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_user1Id_user2Id_key" ON "Friendship"("user1Id", "user2Id");

-- CreateIndex
CREATE UNIQUE INDEX "MatchmakingQueue_userId_key" ON "MatchmakingQueue"("userId");

-- CreateIndex
CREATE INDEX "MatchmakingQueue_timeControlType_idx" ON "MatchmakingQueue"("timeControlType");

-- CreateIndex
CREATE INDEX "MatchmakingQueue_createdAt_idx" ON "MatchmakingQueue"("createdAt");

-- CreateIndex
CREATE INDEX "GameMessage_gameId_idx" ON "GameMessage"("gameId");

-- CreateIndex
CREATE INDEX "GameMessage_senderId_idx" ON "GameMessage"("senderId");

-- CreateIndex
CREATE INDEX "GameEvent_gameId_idx" ON "GameEvent"("gameId");

-- CreateIndex
CREATE INDEX "GameEvent_type_idx" ON "GameEvent"("type");

-- CreateIndex
CREATE INDEX "Game_status_idx" ON "Game"("status");

-- CreateIndex
CREATE INDEX "Game_createdAt_idx" ON "Game"("createdAt");

-- CreateIndex
CREATE INDEX "Move_gameId_idx" ON "Move"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "Move_gameId_moveNumber_key" ON "Move"("gameId", "moveNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "GameParticipant" ADD CONSTRAINT "GameParticipant_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameParticipant" ADD CONSTRAINT "GameParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Move" ADD CONSTRAINT "Move_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchmakingQueue" ADD CONSTRAINT "MatchmakingQueue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameMessage" ADD CONSTRAINT "GameMessage_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameMessage" ADD CONSTRAINT "GameMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameEvent" ADD CONSTRAINT "GameEvent_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
