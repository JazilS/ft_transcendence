/*
  Warnings:

  - You are about to drop the column `board` on the `GameHistory` table. All the data in the column will be lost.
  - You are about to drop the column `winner` on the `GameHistory` table. All the data in the column will be lost.
  - You are about to drop the `_GameHistoryToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `OpponentName` to the `GameHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserName` to the `GameHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scoreOpponent` to the `GameHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scoreUser` to the `GameHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `GameHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_GameHistoryToUser" DROP CONSTRAINT "_GameHistoryToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_GameHistoryToUser" DROP CONSTRAINT "_GameHistoryToUser_B_fkey";

-- AlterTable
ALTER TABLE "GameHistory" DROP COLUMN "board",
DROP COLUMN "winner",
ADD COLUMN     "OpponentName" TEXT NOT NULL,
ADD COLUMN     "UserName" TEXT NOT NULL,
ADD COLUMN     "scoreOpponent" TEXT NOT NULL,
ADD COLUMN     "scoreUser" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_GameHistoryToUser";

-- AddForeignKey
ALTER TABLE "GameHistory" ADD CONSTRAINT "GameHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
