import supertest from 'supertest';
import db from '../prismaClient';
import server from '../RestServer';
import { RecipeApiUpload } from '../types/Recipe';

describe('Placeholder test', () => {
  test('return true', () => {
    expect(true).toBe(true);
  });
});
// describe.skip('Get data devices info data', () => {
//   test('GET /api/data', async () => {
//     const response = await supertest(server).get('/api/data').send();
//     expect(JSON.parse(response.text)?.brewStatus).toBe('IDLE');
//     expect(response.statusCode).toBe(200);
//   });
// });

// describe.skip('Get all recipes', () => {
//   test('GET /api/recipe', async () => {
//     const response = await supertest(server).get(`/api/recipe`).send();
//     expect(JSON.parse(response.text)).toEqual(
//       expect.arrayContaining([
//         expect.objectContaining({git
//           name: 'Smoky Grove Lichtenhainer',
//           locked: true,
//         }),
//         expect.objectContaining({
//           name: 'Vanilla Cream Ale',
//           locked: false,
//         }),
//       ])
//     );
//     expect(response.statusCode).toBe(200);
//   });
// });

// describe.skip('Get recipe by id', () => {
//   test('GET /api/recipe/recipeId', async () => {
//     // get recipe by name for getting right index
//     const recipe = await db.recipes.findUnique({
//       where: {
//         name: 'Smoky Grove Lichtenhainer',
//       },
//     });
//     const response = await supertest(server).get(`/api/recipe/${recipe.id}`);
//     expect(JSON.parse(response.text)).toEqual(
//       expect.objectContaining({
//         name: 'Smoky Grove Lichtenhainer',
//         locked: true,
//         Ingredients: expect.arrayContaining([
//           expect.objectContaining({
//             name: 'American - Pale 2-Row',
//             type: 'Fermentable',
//             units: 'Kg',
//           }),
//         ]),
//       })
//     );
//     expect(response.statusCode).toBe(200);
//   });
// });

// describe.skip('Load recipe Smoky Grove Lichtenhainer', () => {
//   test('POST /api/recipe/recipeId/load', async () => {
//     // get recipe by name for getting right index
//     const recipe = await db.recipes.findUnique({
//       where: {
//         name: 'Smoky Grove Lichtenhainer',
//       },
//     });
//     const response = await supertest(server)
//       .post(`/api/recipe/${recipe.id}/load`)
//       .send();
//     expect(response.statusCode).toBe(200);
//     expect(response.headers['content-type']).toEqual(
//       expect.stringContaining('json')
//     );
//     expect(JSON.parse(response.text)?.name).toBe('Smoky Grove Lichtenhainer');
//   });
// });

// describe.skip('Add new recipe', () => {
//   const name = `Testing recipe ${Math.random() * 10000}`;
//   test('PUT /api/recipe', async () => {
//     const newRecipe: RecipeApiUpload = {
//       name,
//       description: "I have no idea what I'am doing",
//       locked: false,
//       Ingredients: [
//         {
//           name: 'American - Pale 2-Row',
//           amount: 5.6,
//           type: 'Fermentable',
//           units: 'Kg',
//         },
//         {
//           name: 'Fermentis - Safale - American Ale Yeast US-05',
//           amount: 1,
//           type: 'Yeast',
//           units: '',
//         },
//       ],
//       Instructions: [
//         // TODO - Peto - musis tieto IDcka z niekade dynamicky ziskavat, inak to nebude fungovat
//         // {
//         //   templateId: 4,
//         //   param: null,
//         //   optionCodeName: 'FERMENTABLE',
//         //   blockName: 'Fermentation',
//         //   ordering: 4,
//         // },
//         // {
//         //   templateId: 1,
//         //   param: '60',
//         //   optionCodeName: 'TEMP_1',
//         //   blockName: 'Fermentation',
//         //   ordering: 3,
//         // },
//       ],
//     };
//     const response = await supertest(server).put(`/api/recipe`).send(newRecipe);
//     expect(response.statusCode).toBe(200);
//     expect(response.headers['content-type']).toEqual(
//       expect.stringContaining('json')
//     );
//     console.log(response.text);
//     expect(JSON.parse(response.text)?.id).toBeDefined();
//   });

//   afterAll(async () => {
//     // delete created recipe
//     await db.recipes.delete({
//       where: {
//         name,
//       },
//     });
//   });
// });

// describe.skip('Load, start loaded recipe and abort test', () => {
//   test('PUT /api/brew/0/start', async () => {
//     const recipe = await db.recipes.findUnique({
//       where: {
//         name: 'Smoky Grove Lichtenhainer',
//       },
//     });
//     await supertest(server).post(`/api/recipe/${recipe.id}/load`).send();
//     await supertest(server).put('/api/brew/0/start').send({
//       recipeId: recipe.id,
//     });
//     const response = await supertest(server).get('/api/data').send();
//     expect(JSON.parse(response.text)?.brewStatus).toBe('IN_PROGRESS');
//     expect(response.statusCode).toBe(200);
//   });
// });

// beforeAll(async () => {
//   // DB connection test
//   (async () => {
//     try {
//       await db.$connect();
//       logger.info('Connected to database successfully');
//     } catch (e) {
//       logger.error('Error connecting to database');
//       // queryErrorHanlder(e, 'Connection test');
//     }
//   })();
// });
