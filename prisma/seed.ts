import { PrismaClient, Prisma } from '@prisma/client';
import logger from '../src/logger';

const db = new PrismaClient();

async function seedData() {
  logger.info('Seeding data...');

  const recipeInclude: Prisma.RecipesInclude = {
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
  };

  const templates: Prisma.FunctionTemplatesCreateInput[] = [
    {
      codeName: 'SET_TEMPERATURE',
      name: 'Temperature',
      category: 'TEMPERATURE',
      units: '°C',
      inputType: 'float',
      description: 'Sets temerature for selected chamber',
      FunctionOptions: {
        create: [
          {
            name: 'Chamber 1',
            codeName: 'TEMP_1',
            module: 1,
          },
          {
            name: 'Chamber 2',
            codeName: 'TEMP_2',
            module: 1,
          },
        ],
      },
    },
    {
      codeName: 'SET_MOTOR_SPEED',
      name: 'Motor',
      category: 'MOTOR',
      units: 'RPM',
      inputType: 'float',
      description: 'Sets rpms for selected motor',
      FunctionOptions: {
        create: [
          {
            name: 'Motor 1',
            codeName: 'MOTOR_1',
            module: 1,
          },
          {
            name: 'Motor 2',
            codeName: 'MOTOR_2',
            module: 1,
          },
        ],
      },
    },
    {
      codeName: 'TRANSFER_LIQUIDS',
      name: 'Transfer liquids',
      category: 'PUMP',
      description: 'Transfers liquids from first chamber to second',
      FunctionOptions: {
        create: [
          {
            name: 'Pump 1',
            codeName: 'PUMP_1',
            module: 1,
          },
        ],
      },
    },
    {
      codeName: 'UNLOAD',
      name: 'Unload',
      category: 'UNLOADER',
      description: 'Unloads selected ingredient into chamber',
      FunctionOptions: {
        create: [
          {
            name: 'Fermentables',
            codeName: 'FERMENTABLE',
            module: 1,
          },
          {
            name: 'Yeast',
            codeName: 'YEAST',
            module: 1,
          },
          {
            name: 'Hops',
            codeName: 'HOPS',
            module: 1,
          },
          {
            name: 'Other',
            codeName: 'OTHER',
            module: 1,
          },
        ],
      },
    },
    {
      codeName: 'WAIT',
      name: 'Wait',
      category: 'SYSTEM',
      units: 'Minutes',
      inputType: 'float',
      description: 'System will wait for given amount of minues',
    },
    {
      codeName: 'MANUAL',
      name: 'Manual step',
      category: 'SYSTEM',
      inputType: 'string',
      description: 'System will wait for manual inervention',
    },
    {
      codeName: 'ENABLE_RELAY',
      name: 'Relay',
      category: 'RELAY',
      description: 'Enables relay',
      FunctionOptions: {
        create: [
          {
            name: 'Relay 1',
            codeName: 'RELAY_1',
            module: 1,
          },
          {
            name: 'Relay 2',
            codeName: 'RELAY_2',
            module: 1,
          },
          {
            name: 'Pump',
            codeName: 'RELAY_3',
            module: 1,
          },
        ],
      },
    },
  ];

  const recipes: Prisma.RecipesCreateInput[] = [
    {
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
            param: '100',
            FunctionTemplates: {
              connect: {
                codeName: 'SET_MOTOR_SPEED',
              },
            },
            FunctionOptions: {
              connect: {
                codeName: 'MOTOR_1',
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
            param: '50000',
            FunctionTemplates: {
              connect: {
                codeName: 'WAIT',
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
            param: '60',
            FunctionTemplates: {
              connect: {
                codeName: 'SET_TEMPERATURE',
              },
            },
            FunctionOptions: {
              connect: {
                codeName: 'TEMP_1',
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
                codeName: 'UNLOAD',
              },
            },
            FunctionOptions: {
              connect: {
                codeName: 'FERMENTABLE',
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
    {
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
            param: '100',
            FunctionTemplates: {
              connect: {
                codeName: 'SET_TEMPERATURE',
              },
            },
            FunctionOptions: {
              connect: {
                codeName: 'TEMP_1',
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
            param: '120000',
            FunctionTemplates: {
              connect: {
                codeName: 'WAIT',
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
            param: 'Do something',
            FunctionTemplates: {
              connect: {
                codeName: 'MANUAL',
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
                codeName: 'UNLOAD',
              },
            },
            FunctionOptions: {
              connect: {
                codeName: 'HOPS',
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
                codeName: 'TRANSFER_LIQUIDS',
              },
            },
            FunctionOptions: {
              connect: {
                codeName: 'PUMP_1',
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
            param: '200',
            FunctionTemplates: {
              connect: {
                codeName: 'SET_MOTOR_SPEED',
              },
            },
            FunctionOptions: {
              connect: {
                codeName: 'MOTOR_2',
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
  ];
  await Promise.all(
    templates.map(async (template) => {
      await db.functionTemplates.create({
        data: template,
      });
    })
  );

  // eslint-disable-next-line no-restricted-syntax
  for (const recipe of recipes) {
    // eslint-disable-next-line no-await-in-loop
    const result = await db.recipes.create({
      data: recipe,
      include: recipeInclude,
    });
    logger.child({ recipe: result }).info('Added recipe');
  }
  logger.info('Seeded new data!');
}

async function main() {
  await seedData();
}

main()
  .catch((e) => {
    logger.error(e);
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
