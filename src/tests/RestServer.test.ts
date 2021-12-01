// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from 'supertest';
import server from '../RestServer';
import db from '../prismaClient';

describe('Load recipe Smoky Grove Lichtenhainer', () => {
  test('send post request to load recipe', async () => {
    // get recipe by name for getting right index
    const recipe = await db.recipes.findUnique({
      where: {
        name: 'Smoky Grove Lichtenhainer',
      },
    });
    const response = await supertest(server)
      .post(`/api/recipe/${recipe.id}/load`)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
    expect(JSON.parse(response.text)?.name).toBe('Smoky Grove Lichtenhainer');
  });
});

// todo test starting the recipe

describe('Load and start loaded test', () => {
  test('send put request to start recipe', async () => {
    const recipe = await db.recipes.findUnique({
      where: {
        name: 'Smoky Grove Lichtenhainer',
      },
    });
    await supertest(server).post(`/api/recipe/${recipe.id}/load`).send();
    await supertest(server).put('/api/brew/0/start').send();
    const response = await supertest(server).get('/api/data').send();
    console.log(response.text);
    expect(response.statusCode).toBe(200);
  });
});

describe('Get data devices info data', () => {
  test('send get request', async () => {
    const response = await supertest(server).get('/api/data').send();
    console.log(response.text);
    expect(response.statusCode).toBe(200);
  });
});
