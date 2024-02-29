/*
  Warnings:

  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GameToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GameToUser" DROP CONSTRAINT "_GameToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_GameToUser" DROP CONSTRAINT "_GameToUser_B_fkey";

-- DropTable
DROP TABLE "Game";

-- DropTable
DROP TABLE "_GameToUser";

-- CreateTable
CREATE TABLE "GameHistory" (
    "id" TEXT NOT NULL,
    "winner" TEXT NOT NULL,
    "winnerId" TEXT NOT NULL,
    "looser" TEXT NOT NULL,
    "looserId" TEXT NOT NULL,

    CONSTRAINT "GameHistory_pkey" PRIMARY KEY ("id")
);
