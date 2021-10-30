/*
  Warnings:

  - You are about to drop the column `reciepe_id` on the `Brewings` table. All the data in the column will be lost.
  - You are about to drop the column `module_id` on the `Function_templates` table. All the data in the column will be lost.
  - You are about to drop the column `params` on the `Function_templates` table. All the data in the column will be lost.
  - You are about to drop the column `reciepe_id` on the `Ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `finished_at` on the `Instruction_logs` table. All the data in the column will be lost.
  - You are about to drop the column `started_at` on the `Instruction_logs` table. All the data in the column will be lost.
  - You are about to drop the column `params` on the `Instructions` table. All the data in the column will be lost.
  - You are about to drop the column `reciepe_id` on the `Instructions` table. All the data in the column will be lost.
  - You are about to drop the column `step_id` on the `Instructions` table. All the data in the column will be lost.
  - You are about to drop the `Modules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recepies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Steps` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code_name]` on the table `Function_templates` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `Function_templates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code_name` to the `Function_templates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `input_type` to the `Function_templates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `units` to the `Function_templates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipe_id` to the `Ingredients` table without a default value. This is not possible if the table is not empty.
  - Made the column `brewing_id` on table `Instruction_logs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `instruction_id` on table `Instruction_logs` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `block_id` to the `Instructions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `function_option_id` to the `Instructions` table without a default value. This is not possible if the table is not empty.
  - Made the column `function_template_id` on table `Instructions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ordering` on table `Instructions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `brewing_id` on table `Status_logs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `params` on table `Status_logs` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Brewings" DROP CONSTRAINT "Brewings_reciepe_id_fkey";

-- DropForeignKey
ALTER TABLE "Function_templates" DROP CONSTRAINT "Function_templates_module_id_fkey";

-- DropForeignKey
ALTER TABLE "Ingredients" DROP CONSTRAINT "Ingredients_reciepe_id_fkey";

-- DropForeignKey
ALTER TABLE "Instructions" DROP CONSTRAINT "Instructions_reciepe_id_fkey";

-- DropForeignKey
ALTER TABLE "Instructions" DROP CONSTRAINT "Instructions_step_id_fkey";

-- DropIndex
DROP INDEX "Function_templates_name_key";

-- AlterTable
ALTER TABLE "Brewings" DROP COLUMN "reciepe_id",
ADD COLUMN     "recipe_id" INTEGER;

-- AlterTable
ALTER TABLE "Function_templates" DROP COLUMN "module_id",
DROP COLUMN "params",
ADD COLUMN     "category" VARCHAR NOT NULL,
ADD COLUMN     "code_name" VARCHAR NOT NULL,
ADD COLUMN     "input_type" VARCHAR NOT NULL,
ADD COLUMN     "units" VARCHAR NOT NULL;

-- AlterTable
ALTER TABLE "Ingredients" DROP COLUMN "reciepe_id",
ADD COLUMN     "recipe_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Instruction_logs" DROP COLUMN "finished_at",
DROP COLUMN "started_at",
ADD COLUMN     "finished" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "brewing_id" SET NOT NULL,
ALTER COLUMN "instruction_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Instructions" DROP COLUMN "params",
DROP COLUMN "reciepe_id",
DROP COLUMN "step_id",
ADD COLUMN     "block_id" INTEGER NOT NULL,
ADD COLUMN     "function_option_id" INTEGER NOT NULL,
ADD COLUMN     "param" JSON,
ALTER COLUMN "function_template_id" SET NOT NULL,
ALTER COLUMN "ordering" SET NOT NULL;

-- AlterTable
ALTER TABLE "Status_logs" ALTER COLUMN "brewing_id" SET NOT NULL,
ALTER COLUMN "params" SET NOT NULL;

-- DropTable
DROP TABLE "Modules";

-- DropTable
DROP TABLE "Recepies";

-- DropTable
DROP TABLE "Steps";

-- CreateTable
CREATE TABLE "Function_options" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "code_name" VARCHAR NOT NULL,
    "module" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Function_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipes" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" VARCHAR,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blocks" (
    "id" SERIAL NOT NULL,
    "recipe_id" INTEGER NOT NULL,
    "name" VARCHAR,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Function_optionsToFunction_templates" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Recipes_name_key" ON "Recipes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_Function_optionsToFunction_templates_AB_unique" ON "_Function_optionsToFunction_templates"("A", "B");

-- CreateIndex
CREATE INDEX "_Function_optionsToFunction_templates_B_index" ON "_Function_optionsToFunction_templates"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Function_templates_code_name_key" ON "Function_templates"("code_name");

-- AddForeignKey
ALTER TABLE "Brewings" ADD CONSTRAINT "Brewings_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "Recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Instructions" ADD CONSTRAINT "Instructions_function_option_id_fkey" FOREIGN KEY ("function_option_id") REFERENCES "Function_options"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Instructions" ADD CONSTRAINT "Instructions_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "Blocks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Ingredients" ADD CONSTRAINT "Ingredients_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "Recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Blocks" ADD CONSTRAINT "Blocks_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "Recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "_Function_optionsToFunction_templates" ADD FOREIGN KEY ("A") REFERENCES "Function_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Function_optionsToFunction_templates" ADD FOREIGN KEY ("B") REFERENCES "Function_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
