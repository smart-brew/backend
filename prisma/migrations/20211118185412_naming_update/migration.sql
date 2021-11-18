/*
  Warnings:

  - You are about to drop the `Function_options` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Function_templates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Instruction_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Status_logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Brewings" DROP CONSTRAINT "Brewings_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "Function_options" DROP CONSTRAINT "Function_options_function_template_id_fkey";

-- DropForeignKey
ALTER TABLE "Instruction_logs" DROP CONSTRAINT "Instruction_logs_brewing_id_fkey";

-- DropForeignKey
ALTER TABLE "Instruction_logs" DROP CONSTRAINT "Instruction_logs_instruction_id_fkey";

-- DropForeignKey
ALTER TABLE "Instructions" DROP CONSTRAINT "Instructions_block_id_fkey";

-- DropForeignKey
ALTER TABLE "Instructions" DROP CONSTRAINT "Instructions_function_option_id_fkey";

-- DropForeignKey
ALTER TABLE "Instructions" DROP CONSTRAINT "Instructions_function_template_id_fkey";

-- DropForeignKey
ALTER TABLE "Status_logs" DROP CONSTRAINT "Status_logs_brewing_id_fkey";

-- AlterTable
ALTER TABLE "Instructions" ALTER COLUMN "block_id" DROP NOT NULL;

-- DropTable
DROP TABLE "Function_options";

-- DropTable
DROP TABLE "Function_templates";

-- DropTable
DROP TABLE "Instruction_logs";

-- DropTable
DROP TABLE "Status_logs";

-- CreateTable
CREATE TABLE "FunctionTemplates" (
    "id" SERIAL NOT NULL,
    "code_name" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "category" VARCHAR NOT NULL,
    "units" VARCHAR,
    "input_type" VARCHAR,
    "description" VARCHAR,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FunctionTemplates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstructionLogs" (
    "id" SERIAL NOT NULL,
    "brewing_id" INTEGER NOT NULL,
    "instruction_id" INTEGER,
    "finished" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstructionLogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FunctionOptions" (
    "id" SERIAL NOT NULL,
    "function_template_id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,
    "code_name" VARCHAR NOT NULL,
    "module" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FunctionOptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusLogs" (
    "id" SERIAL NOT NULL,
    "brewing_id" INTEGER NOT NULL,
    "status" VARCHAR,
    "params" JSON NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StatusLogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FunctionTemplates_code_name_key" ON "FunctionTemplates"("code_name");

-- CreateIndex
CREATE UNIQUE INDEX "FunctionOptions_code_name_key" ON "FunctionOptions"("code_name");

-- AddForeignKey
ALTER TABLE "Brewings" ADD CONSTRAINT "Brewings_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "Recipes"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "InstructionLogs" ADD CONSTRAINT "InstructionLogs_brewing_id_fkey" FOREIGN KEY ("brewing_id") REFERENCES "Brewings"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "InstructionLogs" ADD CONSTRAINT "InstructionLogs_instruction_id_fkey" FOREIGN KEY ("instruction_id") REFERENCES "Instructions"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Instructions" ADD CONSTRAINT "Instructions_function_option_id_fkey" FOREIGN KEY ("function_option_id") REFERENCES "FunctionOptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Instructions" ADD CONSTRAINT "Instructions_function_template_id_fkey" FOREIGN KEY ("function_template_id") REFERENCES "FunctionTemplates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Instructions" ADD CONSTRAINT "Instructions_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "Blocks"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "FunctionOptions" ADD CONSTRAINT "FunctionOptions_function_template_id_fkey" FOREIGN KEY ("function_template_id") REFERENCES "FunctionTemplates"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StatusLogs" ADD CONSTRAINT "StatusLogs_brewing_id_fkey" FOREIGN KEY ("brewing_id") REFERENCES "Brewings"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
