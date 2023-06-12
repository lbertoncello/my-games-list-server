import dbLoader from '../../../src/main/loaders/db-loader.js';

describe('DB Loader', () => {
  let connection = null;

  beforeAll(async () => {
    // Get mongodb memory server url from env
    connection = await dbLoader(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await connection.close();
  });

  test('Should reconnect if mongodb is down', async () => {
    let accountCollection = await connection.collection('users');
    expect(accountCollection).toBeTruthy();

    await connection.close();
    accountCollection = await connection.collection('users');
    expect(accountCollection).toBeTruthy();
  });
});
