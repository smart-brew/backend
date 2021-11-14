/*
  Warnings:

  - You are about to drop the `_Function_optionsToFunction_templates` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `function_template_id` to the `Function_options` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_Function_optionsToFunction_templates" DROP CONSTRAINT "_Function_optionsToFunction_templates_A_fkey";

-- DropForeignKey
ALTER TABLE "_Function_optionsToFunction_templates" DROP CONSTRAINT "_Function_optionsToFunction_templates_B_fkey";

-- AlterTable
ALTER TABLE "Function_options" ADD COLUMN     "function_template_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_Function_optionsToFunction_templates";

-- AddForeignKey
ALTER TABLE "Function_options" ADD CONSTRAINT "Function_options_function_template_id_fkey" FOREIGN KEY ("function_template_id") REFERENCES "Function_templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
