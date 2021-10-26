/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Steps` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Steps_name_key" ON "Steps"("name");
