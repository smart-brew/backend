/*
  Warnings:

  - A unique constraint covering the columns `[code_name]` on the table `Function_options` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Function_options_code_name_key" ON "Function_options"("code_name");
