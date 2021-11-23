// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from 'supertest';
import server from '../RestServer';

describe('Get data devices info data ', () => {
  test('send get request', async () => {
    const response = await supertest(server).get('/api/data').send();

    expect(response.statusCode).toBe(200);
  });
});

test('it should pass', async () => {
  expect(true).toBe(true);
});
