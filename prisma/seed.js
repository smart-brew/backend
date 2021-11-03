import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  await db.function_templates.upsert({
    where: { code_name: 'SET_TEMPERATURE' },
    update: {},
    create: {
      code_name: 'SET_TEMPERATURE',
      name: 'Temperature',
      category: 'TEMPERATURE',
      units: '°C',
      input_type: 'float',
      description: 'Sets temerature for selected chamber',
      Function_options: {
        create: [
          {
            name: 'Chamber 1',
            code_name: 'TEMP_1',
            module: 1,
          },
          {
            name: 'Chamber 2',
            code_name: 'TEMP_2',
            module: 1,
          },
        ],
      },
    },
  });

  await db.function_templates.upsert({
    where: { code_name: 'SET_MOTOR_SPEED' },
    update: {},
    create: {
      code_name: 'SET_MOTOR_SPEED',
      name: 'Motor',
      category: 'MOTOR',
      units: 'RMP',
      input_type: 'float',
      description: 'Sets rpms for selected motor',
      Function_options: {
        create: [
          {
            name: 'Motor 1',
            code_name: 'MOTOR_1',
            module: 2,
          },
          {
            name: 'Motor 2',
            code_name: 'MOTOR_2',
            module: 2,
          },
        ],
      },
    },
  });

  await db.function_templates.upsert({
    where: { code_name: 'TRANSFER_LIQUIDS' },
    update: {},
    create: {
      code_name: 'TRANSFER_LIQUIDS',
      name: 'Transfer liquids',
      category: 'PUMP',
      description: 'Transfers liquids from first chamber to second',
      Function_options: {
        create: [
          {
            name: 'Pump 1',
            code_name: 'PUMP_1',
            module: 3,
          },
        ],
      },
    },
  });

  await db.function_templates.upsert({
    where: { code_name: 'UNLOAD' },
    update: {},
    create: {
      code_name: 'UNLOAD',
      name: 'Unload',
      category: 'UNLOADER',
      description: 'Unloads selected ingredient into chamber',
      Function_options: {
        create: [
          {
            name: 'Fermentables',
            code_name: 'FERMENTABLE',
            module: 4,
          },
          {
            name: 'Yeast',
            code_name: 'YEAST',
            module: 4,
          },
          {
            name: 'Hops',
            code_name: 'HOPS',
            module: 4,
          },
          {
            name: 'Other',
            code_name: 'OTHER',
            module: 4,
          },
        ],
      },
    },
  });

  await db.function_templates.upsert({
    where: { code_name: 'WAIT' },
    update: {},
    create: {
      code_name: 'WAIT',
      name: 'Wait',
      category: 'SYSTEM',
      units: 'Minutes',
      input_type: 'float',
      description: 'System will wait for given amount of minues',
    },
  });

  await db.function_templates.upsert({
    where: { code_name: 'MANUAL' },
    update: {},
    create: {
      code_name: 'MANUAL',
      name: 'Manual step',
      category: 'SYSTEM',
      input_type: 'string',
      description: 'System will wait for manual inervention',
    },
  });

  await db.recipes.deleteMany({
    where: {
      name: 'TEST_RECIPE_1',
    },
  });

  await db.recipes.deleteMany({
    where: {
      name: 'TEST_RECIPE_2',
    },
  });

  const recept1 = await db.recipes.upsert({
    where: { name: 'TEST_RECIPE_1' },
    update: {},
    create: {
      name: 'TEST_RECIPE_1',
      description: 'Seed recipe 1',
      locked: false,
      Ingredients: {
        create: [
          {
            name: 'Some ingredient',
            amount: 5.6,
            type: 'Hops',
            units: 'Kg',
          },
          {
            name: 'Some different ingredient',
            amount: 1,
            type: 'Yeast',
            units: 'Pcs',
          },
        ],
      },
      Instructions: {
        create: [
          {
            ordering: 1,
            param: { rpms: '100' },
            Function_templates: {
              connect: {
                code_name: 'SET_MOTOR_SPEED',
              },
            },
            Function_options: {
              connect: {
                code_name: 'MOTOR_1',
              },
            },
            Blocks: {
              connectOrCreate: {
                where: {
                  name: 'FIRST_BLOCK',
                },
                create: {
                  name: 'FIRST_BLOCK',
                },
              },
            },
          },
          {
            ordering: 2,
            param: { duration: '5' },
            Function_templates: {
              connect: {
                code_name: 'WAIT',
              },
            },
            Blocks: {
              connectOrCreate: {
                where: {
                  name: 'FIRST_BLOCK',
                },
                create: {
                  name: 'FIRST_BLOCK',
                },
              },
            },
          },
          {
            ordering: 3,
            param: { temp: '60' },
            Function_templates: {
              connect: {
                code_name: 'SET_TEMPERATURE',
              },
            },
            Function_options: {
              connect: {
                code_name: 'TEMP_1',
              },
            },
            Blocks: {
              connectOrCreate: {
                where: {
                  name: 'SECOND_BLOCK',
                },
                create: {
                  name: 'SECOND_BLOCK',
                },
              },
            },
          },
          {
            ordering: 4,
            Function_templates: {
              connect: {
                code_name: 'UNLOAD',
              },
            },
            Function_options: {
              connect: {
                code_name: 'FERMENTABLE',
              },
            },
            Blocks: {
              connectOrCreate: {
                where: {
                  name: 'SECOND_BLOCK',
                },
                create: {
                  name: 'SECOND_BLOCK',
                },
              },
            },
          },
        ],
      },
    },
    include: {
      Ingredients: true,
      Instructions: {
        include: {
          Blocks: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  console.log(JSON.stringify(recept1, null, 2));

  const recept2 = await db.recipes.upsert({
    where: { name: 'TEST_RECIPE_2' },
    update: {},
    create: {
      name: 'TEST_RECIPE_2',
      description: 'Seed recipe 2',
      locked: false,
      Ingredients: {
        create: [
          {
            name: 'Nice ingredient',
            amount: 80,
            type: 'Fermentables',
            units: 'g',
          },
          {
            name: 'Nicer ingredient',
            amount: 4,
            type: 'Other',
            units: 'packs',
          },
        ],
      },
      Instructions: {
        create: [
          {
            ordering: 1,
            param: { temp: '100' },
            Function_templates: {
              connect: {
                code_name: 'SET_TEMPERATURE',
              },
            },
            Function_options: {
              connect: {
                code_name: 'TEMP_1',
              },
            },
            Blocks: {
              connectOrCreate: {
                where: {
                  name: 'FIRST_BLOCK',
                },
                create: {
                  name: 'FIRST_BLOCK',
                },
              },
            },
          },
          {
            ordering: 2,
            param: { duration: '20' },
            Function_templates: {
              connect: {
                code_name: 'WAIT',
              },
            },
            Blocks: {
              connectOrCreate: {
                where: {
                  name: 'FIRST_BLOCK',
                },
                create: {
                  name: 'FIRST_BLOCK',
                },
              },
            },
          },
          {
            ordering: 3,
            param: { text: 'Do something' },
            Function_templates: {
              connect: {
                code_name: 'MANUAL',
              },
            },
            Blocks: {
              connectOrCreate: {
                where: {
                  name: 'NEXT_BLOCK',
                },
                create: {
                  name: 'NEXT_BLOCK',
                },
              },
            },
          },
          {
            ordering: 4,
            Function_templates: {
              connect: {
                code_name: 'UNLOAD',
              },
            },
            Function_options: {
              connect: {
                code_name: 'HOPS',
              },
            },
            Blocks: {
              connectOrCreate: {
                where: {
                  name: 'LAST_BLOCK',
                },
                create: {
                  name: 'LAST_BLOCK',
                },
              },
            },
          },
          {
            ordering: 5,
            Function_templates: {
              connect: {
                code_name: 'TRANSFER_LIQUIDS',
              },
            },
            Function_options: {
              connect: {
                code_name: 'PUMP_1',
              },
            },
            Blocks: {
              connectOrCreate: {
                where: {
                  name: 'LAST_BLOCK',
                },
                create: {
                  name: 'LAST_BLOCK',
                },
              },
            },
          },
          {
            ordering: 6,
            param: { rpm: '200' },
            Function_templates: {
              connect: {
                code_name: 'SET_MOTOR_SPEED',
              },
            },
            Function_options: {
              connect: {
                code_name: 'MOTOR_2',
              },
            },
            Blocks: {
              connectOrCreate: {
                where: {
                  name: 'LAST_BLOCK',
                },
                create: {
                  name: 'LAST_BLOCK',
                },
              },
            },
          },
        ],
      },
    },
    include: {
      Ingredients: true,
      Instructions: {
        include: {
          Blocks: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  console.log(JSON.stringify(recept2, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
