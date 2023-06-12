import request from 'supertest';
import app from '../../../src/main/app.js';
import dbLoader from '../../../src/main/loaders/db-loader.js';
import UserDatabase from '../../../src/data-access/database/user-database.js';
import JwtAdapter from '../../../src/data-access/auth/jwt-adapter.js';
import envConfig from '../../../src/main/config/env/env.js';

describe('User Routes', () => {
  let connection = null;
  let database = null;

  const signInUser = async () => {
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
    const jwtAdapter = new JwtAdapter(envConfig.secrets.jwt, envConfig.secrets.jwtExp);
    const decoded = await jwtAdapter.verify(res.body.data.token);

    return { token: res.body.data.token, user: decoded };
  };

  beforeAll(async () => {
    // Get mongodb memory server url from env
    connection = await dbLoader(process.env.MONGO_URL);
    database = new UserDatabase();
  });

  beforeEach(async () => {
    await database.deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  test('Should return the user signed in on success', async () => {
    const { token, user } = await signInUser();
    const res = await request(app).get('/api/v1/user/me').send().set('Authorization', `Bearer ${token}`).expect(200);
    const userSignedIn = res.body.data;

    expect(userSignedIn.id).toBe(user.id);
    expect(userSignedIn.name).toBe('Lucas');
    expect(userSignedIn.email).toBe('lucas@mail.com');
  });

  test('Should update and return the user signed in on success', async () => {
    const { token, user } = await signInUser();
    const res = await request(app)
      .put('/api/v1/user/me')
      .send({
        name: 'Updated Lucas',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const userSignedIn = res.body.data;

    expect(userSignedIn.id).toBe(user.id);
    expect(userSignedIn.name).toBe('Updated Lucas');
  });

  test('Should delete the user signed in on success', async () => {
    const { token } = await signInUser();
    const res = await request(app).delete('/api/v1/user/me').send().set('Authorization', `Bearer ${token}`).expect(200);
    const deleted = res.body.data.deleted;

    expect(deleted).toBeTruthy();
  });
});
