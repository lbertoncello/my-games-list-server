import request from 'supertest';
import express from 'express';
import setupMiddlewares from '../../../src/main/config/setup-middlewares';

const app = express();
setupMiddlewares(app);

describe('Content Type Middleware', () => {
  test('Should return default content type as json', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send('');
    });
    await request(app).get('/test_content_type').expect('content-type', /json/);
  });

  test('Should return XML content type when forced', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml');
      res.send('');
    });
    await request(app).get('/test_content_type_xml').expect('content-type', /xml/);
  });
});
