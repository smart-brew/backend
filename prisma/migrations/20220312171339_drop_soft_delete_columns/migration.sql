/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Instructions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ingredients" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "Instructions" DROP COLUMN "deletedAt";
