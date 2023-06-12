import request from 'supertest';
import express from 'express';
import setupMiddlewares from '../../../src/main/config/setup-middlewares';

const app = express();
setupMiddlewares(app);

describe('Cors Middleware', () => {
  test('Should enable cors', async () => {
    app.get('/test_cors', (req, res) => {
      res.send(req.body);
    });
    await request(app).get('/test_body_parser').expect('access-control-allow-origin', '*');
  });
});
