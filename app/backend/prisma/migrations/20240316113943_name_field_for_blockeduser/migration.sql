/*
  Warnings:

  - Added the required column `name` to the `BlockedUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlockedUser" ADD COLUMN     "name" TEXT NOT NULL;
