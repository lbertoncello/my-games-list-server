import dbLoader from '../../../src/main/loaders/db-loader.js';
import UserDatabase from '../../../src/data-access/database/user-database.js';
import UserRepository from '../../../src/data-access/repositories/user-repository.js';

describe('User Mongo Repository', () => {
  let connection = null;
  let userCollection = null;

  beforeAll(async () => {
    // Get mongodb memory server url from env
    connection = await dbLoader(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    userCollection = new UserDatabase();
    await userCollection.deleteMany({});
  });

  const makeSut = () => {
    return new UserRepository(userCollection);
  };

  test('Should create a user on success', async () => {
    const sut = makeSut();
    const user = await sut.create({
      name: 'Lucas',
      email: 'lucas@mail.com',
      password: '123',
    });

    expect(user).toBeTruthy();
    expect(user.id).toBeTruthy();
    expect(user.name).toBe('Lucas');
    expect(user.email).toBe('lucas@mail.com');
    expect(user.password).toBe('123');
  });

  test('Should get a user by id on success', async () => {
    const sut = makeSut();
    const user = await sut.create({
      name: 'Lucas',
      email: 'lucas@mail.com',
      password: '123',
    });
    const userGot = await sut.getById(user.id);

    expect(userGot).toBeTruthy();
    expect(userGot.id).toBeTruthy();
    expect(userGot.id).toBe(user.id);
    expect(userGot.name).toBe('Lucas');
    expect(userGot.email).toBe('lucas@mail.com');
  });

  test('Should get a user by email on success', async () => {
    const sut = makeSut();
    const user = await sut.create({
      name: 'Lucas',
      email: 'lucas@mail.com',
      password: '123',
    });
    const userGot = await sut.getByEmail('lucas@mail.com');

    expect(userGot).toBeTruthy();
    expect(userGot.id).toBeTruthy();
    expect(userGot.id).toBe(user.id);
    expect(userGot.name).toBe('Lucas');
    expect(userGot.email).toBe('lucas@mail.com');
  });

  test('Should get a user by email with password on success', async () => {
    const sut = makeSut();
    const user = await sut.create({
      name: 'Lucas',
      email: 'lucas@mail.com',
      password: '123',
    });
    const userGot = await sut.getByEmailWithPassword('lucas@mail.com');

    expect(userGot).toBeTruthy();
    expect(userGot.id).toBeTruthy();
    expect(userGot.id).toBe(user.id);
    expect(userGot.name).toBe('Lucas');
    expect(userGot.email).toBe('lucas@mail.com');
    expect(userGot.password).toBe('123');
  });

  test('Should get all users on success', async () => {
    const sut = makeSut();
    const user1 = await sut.create({
      name: 'Lucas1',
      email: 'lucas1@mail.com',
      password: '123',
    });
    const user2 = await sut.create({
      name: 'Lucas2',
      email: 'lucas2@mail.com',
      password: '123',
    });
    const usersGot = await sut.getAll();

    expect(usersGot[0]).toBeTruthy();
    expect(usersGot[0].id).toBeTruthy();
    expect(usersGot[0].id).toBe(user1.id);
    expect(usersGot[0].name).toBe('Lucas1');
    expect(usersGot[0].email).toBe('lucas1@mail.com');
    expect(usersGot[1]).toBeTruthy();
    expect(usersGot[1].id).toBeTruthy();
    expect(usersGot[1].id).toBe(user2.id);
    expect(usersGot[1].name).toBe('Lucas2');
    expect(usersGot[1].email).toBe('lucas2@mail.com');
  });

  test('Should delete a user by id on success', async () => {
    const sut = makeSut();
    const user = await sut.create({
      name: 'Lucas',
      email: 'lucas@mail.com',
      password: '123',
    });
    const res = await sut.deleteById(user.id);
    const userGot = await sut.getById(user.id);

    expect(userGot).toBeFalsy();
    expect(res).toBeTruthy();
    expect(res.deleted).toBeTruthy();
  });

  test('Should update a user on success', async () => {
    const sut = makeSut();
    const user = await sut.create({
      name: 'Lucas1',
      email: 'lucas1@mail.com',
      password: '123',
    });
    const updatedUser = await sut.updateById(user.id, {
      name: 'Lucas2',
      email: 'lucas2@mail.com',
      password: '1234',
    });
    const gotUser = await sut.getByEmailWithPassword(updatedUser.email);

    expect(updatedUser).toBeTruthy();
    expect(updatedUser.id).toBeTruthy();
    expect(updatedUser.name).toBe('Lucas2');
    expect(updatedUser.email).toBe('lucas2@mail.com');
    expect(gotUser.password).toBe('1234');
  });
});
