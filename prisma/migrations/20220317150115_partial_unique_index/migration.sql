-- DropIndex
DROP INDEX "Recipes_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Recipes_name_key" ON "Recipes"("name") WHERE "deletedAt" IS NULL;