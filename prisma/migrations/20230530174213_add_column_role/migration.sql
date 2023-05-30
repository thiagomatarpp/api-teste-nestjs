/*
  Warnings:

  - You are about to drop the column `birthDate` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "birthDate",
ADD COLUMN     "birthAt" DATE,
ADD COLUMN     "role" INTEGER NOT NULL DEFAULT 1;
