-- CreateEnum
CREATE TYPE "TYPE" AS ENUM ('DM', 'PUBLIC', 'PROTECTED', 'PRIVATE');

-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('CREATOR', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "RESTRICTION" AS ENUM ('NONE', 'MUTED', 'BANNED', 'KICKED');

-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('ONLINE', 'OFFLINE', 'PLAYING');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "bannedFromRooms" TEXT[],
    "roomOnId" TEXT,
    "blockedUsers" TEXT[],
    "blockedByUsers" TEXT[],
    "email" TEXT NOT NULL,
    "status" "STATUS" NOT NULL DEFAULT 'OFFLINE',
    "twoFa" BOOLEAN NOT NULL DEFAULT false,
    "twoFaSecret" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "emitterId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chatroom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "chatroomType" "TYPE" NOT NULL,

    CONSTRAINT "Chatroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatroomUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chatroomId" TEXT NOT NULL,
    "role" "ROLE" NOT NULL,
    "restriction" "RESTRICTION" NOT NULL,

    CONSTRAINT "ChatroomUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatroomRestrictedUsers" (
    "id" TEXT NOT NULL,
    "chatroomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "restriction" "RESTRICTION" NOT NULL,

    CONSTRAINT "ChatroomRestrictedUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameHistory" (
    "id" TEXT NOT NULL,
    "usersId" TEXT[],
    "scoreUser_1" TEXT NOT NULL,
    "scoreUser_2" TEXT NOT NULL,

    CONSTRAINT "GameHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Friends" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GameHistoryToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_roomOnId_key" ON "User"("roomOnId");

-- CreateIndex
CREATE UNIQUE INDEX "Chatroom_name_key" ON "Chatroom"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_Friends_AB_unique" ON "_Friends"("A", "B");

-- CreateIndex
CREATE INDEX "_Friends_B_index" ON "_Friends"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GameHistoryToUser_AB_unique" ON "_GameHistoryToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_GameHistoryToUser_B_index" ON "_GameHistoryToUser"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roomOnId_fkey" FOREIGN KEY ("roomOnId") REFERENCES "Chatroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chatroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_emitterId_fkey" FOREIGN KEY ("emitterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatroomUser" ADD CONSTRAINT "ChatroomUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatroomUser" ADD CONSTRAINT "ChatroomUser_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES "Chatroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatroomRestrictedUsers" ADD CONSTRAINT "ChatroomRestrictedUsers_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES "Chatroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatroomRestrictedUsers" ADD CONSTRAINT "ChatroomRestrictedUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Friends" ADD CONSTRAINT "_Friends_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Friends" ADD CONSTRAINT "_Friends_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameHistoryToUser" ADD CONSTRAINT "_GameHistoryToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "GameHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameHistoryToUser" ADD CONSTRAINT "_GameHistoryToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
