/*
  Warnings:

  - You are about to drop the `ChatroomUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChatroomUsers" DROP CONSTRAINT "ChatroomUsers_chatroomId_fkey";

-- DropForeignKey
ALTER TABLE "ChatroomUsers" DROP CONSTRAINT "ChatroomUsers_userId_fkey";

-- DropTable
DROP TABLE "ChatroomUsers";

-- CreateTable
CREATE TABLE "ChatroomUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chatroomId" TEXT NOT NULL,
    "role" "ROLE" NOT NULL,

    CONSTRAINT "ChatroomUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChatroomUser" ADD CONSTRAINT "ChatroomUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatroomUser" ADD CONSTRAINT "ChatroomUser_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES "Chatroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
