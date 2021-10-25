/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `Brewings` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Function_templates` table. All the data in the column will be lost.
  - You are about to drop the column `param_types` on the `Function_templates` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Instruction_logs` table. All the data in the column will be lost.
  - You are about to drop the column `step_id` on the `Instruction_logs` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Instructions` table. All the data in the column will be lost.
  - The `params` column on the `Instructions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `deleted_at` on the `Modules` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Recepies` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Status_logs` table. All the data in the column will be lost.
  - You are about to drop the column `log_param_mapping_id` on the `Status_logs` table. All the data in the column will be lost.
  - You are about to drop the column `reciepe_id` on the `Status_logs` table. All the data in the column will be lost.
  - You are about to drop the column `step_id` on the `Status_logs` table. All the data in the column will be lost.
  - The `params` column on the `Status_logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `deleted_at` on the `Steps` table. All the data in the column will be lost.
  - You are about to drop the column `reciepe_id` on the `Steps` table. All the data in the column will be lost.
  - You are about to drop the `Log_param_mappings` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `created_at` on table `Brewings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Brewings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `Function_templates` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Function_templates` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `Instruction_logs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Instruction_logs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `Instructions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Instructions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `Modules` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Modules` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `Recepies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Recepies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `Status_logs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Status_logs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `Steps` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Steps` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Instruction_logs" DROP CONSTRAINT "Instruction_logs_step_id_fkey";

-- DropForeignKey
ALTER TABLE "Status_logs" DROP CONSTRAINT "Status_logs_log_param_mapping_id_fkey";

-- DropForeignKey
ALTER TABLE "Status_logs" DROP CONSTRAINT "Status_logs_reciepe_id_fkey";

-- DropForeignKey
ALTER TABLE "Status_logs" DROP CONSTRAINT "Status_logs_step_id_fkey";

-- DropForeignKey
ALTER TABLE "Steps" DROP CONSTRAINT "Steps_reciepe_id_fkey";

-- AlterTable
ALTER TABLE "Brewings" DROP COLUMN "deleted_at",
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Function_templates" DROP COLUMN "deleted_at",
DROP COLUMN "param_types",
ADD COLUMN     "params" JSON,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Instruction_logs" DROP COLUMN "deleted_at",
DROP COLUMN "step_id",
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Instructions" DROP COLUMN "deleted_at",
ADD COLUMN     "ordering" INTEGER,
ADD COLUMN     "reciepe_id" INTEGER,
DROP COLUMN "params",
ADD COLUMN     "params" JSON,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Modules" DROP COLUMN "deleted_at",
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Recepies" DROP COLUMN "deleted_at",
ADD COLUMN     "locked" BOOLEAN,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Status_logs" DROP COLUMN "deleted_at",
DROP COLUMN "log_param_mapping_id",
DROP COLUMN "reciepe_id",
DROP COLUMN "step_id",
ADD COLUMN     "brewing_id" INTEGER,
DROP COLUMN "params",
ADD COLUMN     "params" JSON,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Steps" DROP COLUMN "deleted_at",
DROP COLUMN "reciepe_id",
ADD COLUMN     "name" VARCHAR,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- DropTable
DROP TABLE "Log_param_mappings";

-- CreateTable
CREATE TABLE "Ingredients" (
    "id" SERIAL NOT NULL,
    "reciepe_id" INTEGER,
    "name" VARCHAR,
    "amount" INTEGER,
    "type" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ingredients_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Instructions" ADD CONSTRAINT "Instructions_reciepe_id_fkey" FOREIGN KEY ("reciepe_id") REFERENCES "Recepies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Ingredients" ADD CONSTRAINT "Ingredients_reciepe_id_fkey" FOREIGN KEY ("reciepe_id") REFERENCES "Recepies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Status_logs" ADD CONSTRAINT "Status_logs_brewing_id_fkey" FOREIGN KEY ("brewing_id") REFERENCES "Brewings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
