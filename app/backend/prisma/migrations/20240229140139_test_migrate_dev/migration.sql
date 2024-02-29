/*
  Warnings:

  - You are about to drop the column `OpponentName` on the `GameHistory` table. All the data in the column will be lost.
  - You are about to drop the column `UserName` on the `GameHistory` table. All the data in the column will be lost.
  - You are about to drop the column `scoreOpponent` on the `GameHistory` table. All the data in the column will be lost.
  - You are about to drop the column `scoreUser` on the `GameHistory` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `GameHistory` table. All the data in the column will be lost.
  - Added the required column `scoreUser_1` to the `GameHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scoreUser_2` to the `GameHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GameHistory" DROP CONSTRAINT "GameHistory_userId_fkey";

-- AlterTable
ALTER TABLE "GameHistory" DROP COLUMN "OpponentName",
DROP COLUMN "UserName",
DROP COLUMN "scoreOpponent",
DROP COLUMN "scoreUser",
DROP COLUMN "userId",
ADD COLUMN     "scoreUser_1" TEXT NOT NULL,
ADD COLUMN     "scoreUser_2" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_GameHistoryToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GameHistoryToUser_AB_unique" ON "_GameHistoryToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_GameHistoryToUser_B_index" ON "_GameHistoryToUser"("B");

-- AddForeignKey
ALTER TABLE "_GameHistoryToUser" ADD CONSTRAINT "_GameHistoryToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "GameHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameHistoryToUser" ADD CONSTRAINT "_GameHistoryToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
