/*
  Warnings:

  - You are about to drop the `TestModel` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "blockedByUsers" TEXT[];

-- DropTable
DROP TABLE "TestModel";