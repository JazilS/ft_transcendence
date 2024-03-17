-- AlterTable
ALTER TABLE "User" ADD COLUMN     "twoFa" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFaSecret" TEXT;
