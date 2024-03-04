/*
  Warnings:

  - You are about to drop the column `looser` on the `GameHistory` table. All the data in the column will be lost.
  - You are about to drop the column `winner` on the `GameHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[winnerId,looserId,matchDate]` on the table `GameHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "GameHistory" DROP COLUMN "looser",
DROP COLUMN "winner",
ADD COLUMN     "matchDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Pong" (
    "userId" TEXT NOT NULL,
    "victory" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "rating" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "Pong_userId_key" ON "Pong"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GameHistory_winnerId_looserId_matchDate_key" ON "GameHistory"("winnerId", "looserId", "matchDate");

-- AddForeignKey
ALTER TABLE "Pong" ADD CONSTRAINT "Pong_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameHistory" ADD CONSTRAINT "GameHistory_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Pong"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameHistory" ADD CONSTRAINT "GameHistory_looserId_fkey" FOREIGN KEY ("looserId") REFERENCES "Pong"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
