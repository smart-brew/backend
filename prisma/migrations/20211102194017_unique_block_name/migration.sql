/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Blocks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Blocks_name_key" ON "Blocks"("name");
