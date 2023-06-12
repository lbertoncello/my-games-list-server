import request from 'supertest';
import app from '../../../src/main/app.js';
import dbLoader from '../../../src/main/loaders/db-loader.js';
import GameDatabase from '../../../src/data-access/database/game-database.js';

describe('Game Routes', () => {
  let connection = null;
  let database = null;
  let token = null;

  const getAuthToken = async () => {
    await request(app).post('/api/v1/auth/signup').send({
      name: 'Lucas',
      email: 'lucas@mail.com',
      password: 'sTronG_password!1',
      passwordConfirmation: 'sTronG_password!1',
    });

    const res = await request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'lucas@mail.com',
        password: 'sTronG_password!1',
      })
      .expect(200);

    return res.body.data.token;
  };

  beforeAll(async () => {
    // Get mongodb memory server url from env
    connection = await dbLoader(process.env.MONGO_URL);
    database = new GameDatabase();
    // Get JWT auth token
    token = await getAuthToken();
  });

  beforeEach(async () => {
    await database.deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  test('Should return a game on addGame success', async () => {
    const res = await request(app)
      .post('/api/v1/game')
      .send({
        title: 'Game test title',
        rating: 4.2,
        summary: 'Game test summary',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const game = res.body.data;

    expect(game.title).toBe('Game test title');
    expect(game.rating).toBe(4.2);
    expect(game.summary).toBe('Game test summary');
  });

  test('Should return all games on success', async () => {
    await request(app)
      .post('/api/v1/game')
      .send({
        title: 'Game test title 1',
        rating: 4.1,
        summary: 'Game test summary 1',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    await request(app)
      .post('/api/v1/game')
      .send({
        title: 'Game test title 2',
        rating: 4.2,
        summary: 'Game test summary 2',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const res = await request(app).get('/api/v1/game/all').send().set('Authorization', `Bearer ${token}`).expect(200);
    const games = res.body.data;

    expect(games.length).toBe(2);
  });

  test('Should return a game with the specified id', async () => {
    const insertGameRes = await request(app)
      .post('/api/v1/game')
      .send({
        title: 'Game test title',
        rating: 4.2,
        summary: 'Game test summary',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const insertedGame = insertGameRes.body.data;

    const res = await request(app)
      .get(`/api/v1/game/${insertedGame.id}`)
      .send()
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const requestedGame = res.body.data;

    expect(requestedGame.id).toBe(insertedGame.id);
    expect(requestedGame.title).toBe('Game test title');
    expect(requestedGame.rating).toBe(4.2);
    expect(requestedGame.summary).toBe('Game test summary');
  });

  test('Should return an updated game with the specified id', async () => {
    const insertGameRes = await request(app)
      .post('/api/v1/game')
      .send({
        title: 'Game test title',
        rating: 4.2,
        summary: 'Game test summary',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const insertedGame = insertGameRes.body.data;

    const res = await request(app)
      .put(`/api/v1/game/${insertedGame.id}`)
      .send({
        title: 'Updated Game test title',
        rating: 4.3,
        summary: 'Updated Game test summary',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const requestedGame = res.body.data;

    expect(requestedGame.id).toBe(insertedGame.id);
    expect(requestedGame.title).toBe('Updated Game test title');
    expect(requestedGame.rating).toBe(4.3);
    expect(requestedGame.summary).toBe('Updated Game test summary');
  });

  test('Should delete a game with the specified id', async () => {
    const insertGameRes = await request(app)
      .post('/api/v1/game')
      .send({
        title: 'Game test title',
        rating: 4.2,
        summary: 'Game test summary',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const insertedGame = insertGameRes.body.data;

    const res = await request(app)
      .delete(`/api/v1/game/${insertedGame.id}`)
      .send()
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const deleted = res.body.data.deleted;

    expect(deleted).toBeTruthy();
  });
});
