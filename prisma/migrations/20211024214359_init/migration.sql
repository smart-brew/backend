-- CreateTable
CREATE TABLE "Brewings" (
    "id" SERIAL NOT NULL,
    "reciepe_id" INTEGER,
    "notes" VARCHAR,
    "evaluation" INTEGER,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "Brewings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Function_templates" (
    "id" SERIAL NOT NULL,
    "module_id" INTEGER,
    "name" VARCHAR,
    "description" VARCHAR,
    "param_types" VARCHAR,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "Function_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instruction_logs" (
    "id" SERIAL NOT NULL,
    "brewing_id" INTEGER,
    "step_id" INTEGER,
    "instruction_id" INTEGER,
    "started_at" TIMESTAMP(6),
    "finished_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "Instruction_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instructions" (
    "id" SERIAL NOT NULL,
    "step_id" INTEGER,
    "function_template_id" INTEGER,
    "params" VARCHAR,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "Instructions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log_param_mappings" (
    "id" SERIAL NOT NULL,
    "sensors_mapping" VARCHAR,
    "valid_from" TIMESTAMP(6),
    "valid_to" TIMESTAMP(6),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "Log_param_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Modules" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "description" VARCHAR,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "Modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recepies" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "description" VARCHAR,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "Recepies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status_logs" (
    "id" SERIAL NOT NULL,
    "reciepe_id" INTEGER,
    "step_id" INTEGER,
    "log_param_mapping_id" INTEGER,
    "status" VARCHAR,
    "params" VARCHAR,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "Status_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Steps" (
    "id" SERIAL NOT NULL,
    "reciepe_id" INTEGER,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "Steps_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Brewings" ADD CONSTRAINT "Brewings_reciepe_id_fkey" FOREIGN KEY ("reciepe_id") REFERENCES "Recepies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Function_templates" ADD CONSTRAINT "Function_templates_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Modules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Instruction_logs" ADD CONSTRAINT "Instruction_logs_brewing_id_fkey" FOREIGN KEY ("brewing_id") REFERENCES "Brewings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Instruction_logs" ADD CONSTRAINT "Instruction_logs_instruction_id_fkey" FOREIGN KEY ("instruction_id") REFERENCES "Instructions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Instruction_logs" ADD CONSTRAINT "Instruction_logs_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "Steps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Instructions" ADD CONSTRAINT "Instructions_function_template_id_fkey" FOREIGN KEY ("function_template_id") REFERENCES "Function_templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Instructions" ADD CONSTRAINT "Instructions_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "Steps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Status_logs" ADD CONSTRAINT "Status_logs_log_param_mapping_id_fkey" FOREIGN KEY ("log_param_mapping_id") REFERENCES "Log_param_mappings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Status_logs" ADD CONSTRAINT "Status_logs_reciepe_id_fkey" FOREIGN KEY ("reciepe_id") REFERENCES "Recepies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Status_logs" ADD CONSTRAINT "Status_logs_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "Steps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Steps" ADD CONSTRAINT "Steps_reciepe_id_fkey" FOREIGN KEY ("reciepe_id") REFERENCES "Recepies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
