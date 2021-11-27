// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function main() {
  await db.functionTemplates.upsert({
    where: { code_name: 'SET_TEMPERATURE' },
    update: {},
    create: {
      code_name: 'SET_TEMPERATURE',
      name: 'Temperature',
      category: 'TEMPERATURE',
      units: '°C',
      input_type: 'float',
      description: 'Sets temerature for selected chamber',
      FunctionOptions: {
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

  await db.functionTemplates.upsert({
    where: { code_name: 'SET_MOTOR_SPEED' },
    update: {},
    create: {
      code_name: 'SET_MOTOR_SPEED',
      name: 'Motor',
      category: 'MOTOR',
      units: 'RMP',
      input_type: 'float',
      description: 'Sets rpms for selected motor',
      FunctionOptions: {
        create: [
          {
            name: 'Motor 1',
            code_name: 'MOTOR_1',
            module: 1,
          },
          {
            name: 'Motor 2',
            code_name: 'MOTOR_2',
            module: 1,
          },
        ],
      },
    },
  });

  await db.functionTemplates.upsert({
    where: { code_name: 'TRANSFER_LIQUIDS' },
    update: {},
    create: {
      code_name: 'TRANSFER_LIQUIDS',
      name: 'Transfer liquids',
      category: 'PUMP',
      description: 'Transfers liquids from first chamber to second',
      FunctionOptions: {
        create: [
          {
            name: 'Pump 1',
            code_name: 'PUMP_1',
            module: 1,
          },
        ],
      },
    },
  });

  await db.functionTemplates.upsert({
    where: { code_name: 'UNLOAD' },
    update: {},
    create: {
      code_name: 'UNLOAD',
      name: 'Unload',
      category: 'UNLOADER',
      description: 'Unloads selected ingredient into chamber',
      FunctionOptions: {
        create: [
          {
            name: 'Fermentables',
            code_name: 'FERMENTABLE',
            module: 1,
          },
          {
            name: 'Yeast',
            code_name: 'YEAST',
            module: 1,
          },
          {
            name: 'Hops',
            code_name: 'HOPS',
            module: 1,
          },
          {
            name: 'Other',
            code_name: 'OTHER',
            module: 1,
          },
        ],
      },
    },
  });

  await db.functionTemplates.upsert({
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

  await db.functionTemplates.upsert({
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
    where: { name: 'Smoky Grove Lichtenhainer' },
    update: {},
    create: {
      name: 'Smoky Grove Lichtenhainer',
      description:
        'Light, gently tart, and smoked—lichtenhainer is an unusual beer, yet surprisingly good for all seasons and one you’ll want to brew and enjoy often.',
      locked: true,
      Ingredients: {
        create: [
          {
            name: 'American - Pale 2-Row',
            amount: 5.6,
            type: 'Fermentable',
            units: 'Kg',
          },
          {
            name: 'Fermentis - Safale - American Ale Yeast US-05',
            amount: 1,
            type: 'Yeast',
            units: '',
          },
          {
            name: 'Magnum (Pellet)',
            amount: 1,
            type: 'Hops',
            units: 'oz',
          },
          {
            name: 'Crush whilrfoc Tablet',
            amount: 1,
            type: 'Other',
            units: '',
          },
        ],
      },
      Instructions: {
        create: [
          {
            ordering: 1,
            param: { rpms: '100' },
            FunctionTemplates: {
              connect: {
                code_name: 'SET_MOTOR_SPEED',
              },
            },
            FunctionOptions: {
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
            FunctionTemplates: {
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
            FunctionTemplates: {
              connect: {
                code_name: 'SET_TEMPERATURE',
              },
            },
            FunctionOptions: {
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
            FunctionTemplates: {
              connect: {
                code_name: 'UNLOAD',
              },
            },
            FunctionOptions: {
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
    where: { name: 'Vanilla Cream Ale' },
    update: {},
    create: {
      name: 'Vanilla Cream Ale',
      description:
        'Courtesy of the brewing team at Burke-Gilman in Seattle, here is a homebrew-scale recipe for the double hazy IPA that won GABF gold in 2020.',
      locked: false,
      Ingredients: {
        create: [
          {
            name: 'American - Pale 2-Row',
            amount: 3.5,
            type: 'Fermentable',
            units: 'Kg',
          },
          {
            name: 'American - White Wheat',
            amount: 1,
            type: 'Fermentable',
            units: 'Kg',
          },
          {
            name: 'Wyeast - Kölsch 2565',
            amount: 1,
            type: 'Yeast',
            units: '',
          },
          {
            name: 'Cascade',
            amount: 1,
            type: 'Hops',
            units: 'oz',
          },
          {
            name: 'Crush whilrfoc Tablet',
            amount: 1,
            type: 'Other',
            units: '',
          },
          {
            name: 'Pure vanilla extract',
            amount: 1,
            type: 'Other',
            units: 'oz',
          },
        ],
      },
      Instructions: {
        create: [
          {
            ordering: 1,
            param: { temp: '100' },
            FunctionTemplates: {
              connect: {
                code_name: 'SET_TEMPERATURE',
              },
            },
            FunctionOptions: {
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
            FunctionTemplates: {
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
            FunctionTemplates: {
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
            FunctionTemplates: {
              connect: {
                code_name: 'UNLOAD',
              },
            },
            FunctionOptions: {
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
            FunctionTemplates: {
              connect: {
                code_name: 'TRANSFER_LIQUIDS',
              },
            },
            FunctionOptions: {
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
            FunctionTemplates: {
              connect: {
                code_name: 'SET_MOTOR_SPEED',
              },
            },
            FunctionOptions: {
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
