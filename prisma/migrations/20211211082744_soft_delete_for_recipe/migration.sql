-- AlterTable
ALTER TABLE "Ingredients" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Instructions" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Recipes" ADD COLUMN     "deletedAt" TIMESTAMP(3);
