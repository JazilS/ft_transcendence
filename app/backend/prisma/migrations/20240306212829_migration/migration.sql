/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nickname]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('ONLINE', 'OFFLINE', 'PLAYING');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "nickname" VARCHAR(16),
ADD COLUMN     "status" "STATUS" NOT NULL DEFAULT 'OFFLINE';

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");
