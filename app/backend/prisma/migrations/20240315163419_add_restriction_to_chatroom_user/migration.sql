/*
  Warnings:

  - Added the required column `restriction` to the `ChatroomUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "RESTRICTION" ADD VALUE 'NONE';

-- AlterTable
ALTER TABLE "ChatroomUser" ADD COLUMN     "restriction" "RESTRICTION" NOT NULL;
