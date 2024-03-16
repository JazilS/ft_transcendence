/*
  Warnings:

  - You are about to drop the `BlockedUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BlockedUser" DROP CONSTRAINT "BlockedUser_blockedById_fkey";

-- DropForeignKey
ALTER TABLE "BlockedUser" DROP CONSTRAINT "BlockedUser_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "blockedUsers" TEXT[];

-- DropTable
DROP TABLE "BlockedUser";
