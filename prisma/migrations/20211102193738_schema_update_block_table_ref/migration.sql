/*
  Warnings:

  - You are about to drop the column `recipe_id` on the `Blocks` table. All the data in the column will be lost.
  - Added the required column `recipe_id` to the `Instructions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Blocks" DROP CONSTRAINT "Blocks_recipe_id_fkey";

-- AlterTable
ALTER TABLE "Blocks" DROP COLUMN "recipe_id";

-- AlterTable
ALTER TABLE "Ingredients" ADD COLUMN     "units" VARCHAR;

-- AlterTable
ALTER TABLE "Instructions" ADD COLUMN     "recipe_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Instructions" ADD CONSTRAINT "Instructions_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "Recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
