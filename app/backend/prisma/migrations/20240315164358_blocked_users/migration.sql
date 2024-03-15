/*
  Warnings:

  - You are about to drop the `_BlockedUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BlockedUsers" DROP CONSTRAINT "_BlockedUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_BlockedUsers" DROP CONSTRAINT "_BlockedUsers_B_fkey";

-- DropTable
DROP TABLE "_BlockedUsers";

-- CreateTable
CREATE TABLE "BlockedUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "blockedById" TEXT NOT NULL,

    CONSTRAINT "BlockedUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BlockedUser" ADD CONSTRAINT "BlockedUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedUser" ADD CONSTRAINT "BlockedUser_blockedById_fkey" FOREIGN KEY ("blockedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
