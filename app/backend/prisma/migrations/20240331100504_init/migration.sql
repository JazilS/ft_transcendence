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
    "qrCheck" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "avatar" TEXT,
    "firstname" VARCHAR(25),
    "lastname" VARCHAR(25),

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pong" (
    "userId" TEXT NOT NULL,
    "victory" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "rating" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "GameHistory" (
    "id" TEXT NOT NULL,
    "winnerId" TEXT NOT NULL,
    "looserId" TEXT NOT NULL,
    "matchDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameHistory_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "_Friends" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_roomOnId_key" ON "User"("roomOnId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Pong_userId_key" ON "Pong"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GameHistory_winnerId_looserId_matchDate_key" ON "GameHistory"("winnerId", "looserId", "matchDate");

-- CreateIndex
CREATE UNIQUE INDEX "Chatroom_name_key" ON "Chatroom"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_Friends_AB_unique" ON "_Friends"("A", "B");

-- CreateIndex
CREATE INDEX "_Friends_B_index" ON "_Friends"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roomOnId_fkey" FOREIGN KEY ("roomOnId") REFERENCES "Chatroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pong" ADD CONSTRAINT "Pong_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameHistory" ADD CONSTRAINT "GameHistory_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Pong"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameHistory" ADD CONSTRAINT "GameHistory_looserId_fkey" FOREIGN KEY ("looserId") REFERENCES "Pong"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

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
