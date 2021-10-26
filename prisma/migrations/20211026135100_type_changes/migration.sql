/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Function_templates` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `Function_templates` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Function_templates" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "Ingredients" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "type" SET DATA TYPE VARCHAR;

-- CreateIndex
CREATE UNIQUE INDEX "Function_templates_name_key" ON "Function_templates"("name");
