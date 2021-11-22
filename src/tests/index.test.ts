// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import { server } from '../index';
// import { brewStatus } from '../src/endpoints/brews';

describe('Get data devices info data ', () => {
  test('send get request', async () => {
    const response = await request(server).get('/api/data').send();

    expect(response.statusCode).toBe(200);
  });
});
