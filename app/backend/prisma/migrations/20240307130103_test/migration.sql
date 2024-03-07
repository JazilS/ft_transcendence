/*
  Warnings:

  - You are about to drop the column `room_on_id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roomOnId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_room_on_id_fkey";

-- DropIndex
DROP INDEX "User_room_on_id_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "room_on_id",
ADD COLUMN     "roomOnId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_roomOnId_key" ON "User"("roomOnId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roomOnId_fkey" FOREIGN KEY ("roomOnId") REFERENCES "Chatroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
