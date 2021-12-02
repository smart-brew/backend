-- DropForeignKey
ALTER TABLE "Brewings" DROP CONSTRAINT "Brewings_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "FunctionOptions" DROP CONSTRAINT "FunctionOptions_function_template_id_fkey";

-- DropForeignKey
ALTER TABLE "Ingredients" DROP CONSTRAINT "Ingredients_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "InstructionLogs" DROP CONSTRAINT "InstructionLogs_brewing_id_fkey";

-- DropForeignKey
ALTER TABLE "InstructionLogs" DROP CONSTRAINT "InstructionLogs_instruction_id_fkey";

-- DropForeignKey
ALTER TABLE "Instructions" DROP CONSTRAINT "Instructions_block_id_fkey";

-- DropForeignKey
ALTER TABLE "Instructions" DROP CONSTRAINT "Instructions_function_option_id_fkey";

-- DropForeignKey
ALTER TABLE "Instructions" DROP CONSTRAINT "Instructions_function_template_id_fkey";

-- DropForeignKey
ALTER TABLE "Instructions" DROP CONSTRAINT "Instructions_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "StatusLogs" DROP CONSTRAINT "StatusLogs_brewing_id_fkey";

-- AlterIndex
ALTER INDEX "FunctionOptions_code_name_key" RENAME TO "FunctionOptions_codeName_key";

-- AlterIndex
ALTER INDEX "FunctionTemplates_code_name_key" RENAME TO "FunctionTemplates_codeName_key";

-- AlterTable
ALTER TABLE "Blocks" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "Blocks" RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "Brewings" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "Brewings" RENAME COLUMN "recipe_id" TO "recipeId";
ALTER TABLE "Brewings" RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "FunctionOptions" RENAME COLUMN "code_name" TO "codeName";
ALTER TABLE "FunctionOptions" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "FunctionOptions" RENAME COLUMN "function_template_id" TO "functionTemplateId";
ALTER TABLE "FunctionOptions" RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "FunctionTemplates" RENAME COLUMN "code_name" TO "codeName";
ALTER TABLE "FunctionTemplates" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "FunctionTemplates" RENAME COLUMN "input_type" TO "inputType";
ALTER TABLE "FunctionTemplates" RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "Ingredients" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "Ingredients" RENAME COLUMN "recipe_id" TO "recipeId";
ALTER TABLE "Ingredients" RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "InstructionLogs" RENAME COLUMN "brewing_id" TO "brewingId";
ALTER TABLE "InstructionLogs" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "InstructionLogs" RENAME COLUMN "instruction_id" TO "instructionId";
ALTER TABLE "InstructionLogs" RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "Instructions" RENAME COLUMN "block_id" TO "blockId";
ALTER TABLE "Instructions" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "Instructions" RENAME COLUMN "function_option_id" TO "functionOptionId";
ALTER TABLE "Instructions" RENAME COLUMN "function_template_id" TO "functionTemplateId";
ALTER TABLE "Instructions" RENAME COLUMN "recipe_id" TO "recipeId";
ALTER TABLE "Instructions" RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "Recipes" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "Recipes" RENAME COLUMN "updated_at" to "updatedAt";

-- AlterTable
ALTER TABLE "StatusLogs" RENAME COLUMN "brewing_id" TO "brewingId";
ALTER TABLE "StatusLogs" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "StatusLogs" RENAME COLUMN "updated_at" TO "updatedAt";

-- AddForeignKey
ALTER TABLE "Brewings" ADD CONSTRAINT "Brewings_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipes"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "InstructionLogs" ADD CONSTRAINT "InstructionLogs_brewingId_fkey" FOREIGN KEY ("brewingId") REFERENCES "Brewings"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "InstructionLogs" ADD CONSTRAINT "InstructionLogs_instructionId_fkey" FOREIGN KEY ("instructionId") REFERENCES "Instructions"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Instructions" ADD CONSTRAINT "Instructions_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Instructions" ADD CONSTRAINT "Instructions_functionOptionId_fkey" FOREIGN KEY ("functionOptionId") REFERENCES "FunctionOptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Instructions" ADD CONSTRAINT "Instructions_functionTemplateId_fkey" FOREIGN KEY ("functionTemplateId") REFERENCES "FunctionTemplates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Instructions" ADD CONSTRAINT "Instructions_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Blocks"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "FunctionOptions" ADD CONSTRAINT "FunctionOptions_functionTemplateId_fkey" FOREIGN KEY ("functionTemplateId") REFERENCES "FunctionTemplates"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Ingredients" ADD CONSTRAINT "Ingredients_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StatusLogs" ADD CONSTRAINT "StatusLogs_brewingId_fkey" FOREIGN KEY ("brewingId") REFERENCES "Brewings"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
