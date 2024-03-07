/*
  Warnings:

  - A unique constraint covering the columns `[room_on_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "room_on_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_room_on_id_key" ON "User"("room_on_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_room_on_id_fkey" FOREIGN KEY ("room_on_id") REFERENCES "Chatroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
