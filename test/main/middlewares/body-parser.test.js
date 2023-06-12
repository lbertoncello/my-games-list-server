import request from 'supertest';
import express from 'express';
import setupMiddlewares from '../../../src/main/config/setup-middlewares';

const app = express();
setupMiddlewares(app);

describe('Body Parser Middleware', () => {
  test('Should parse body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body);
    });
    await request(app).post('/test_body_parser').send({ name: 'Lucas' }).expect({ name: 'Lucas' });
  });
});
