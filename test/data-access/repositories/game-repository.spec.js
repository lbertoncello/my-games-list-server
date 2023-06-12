import dbLoader from '../../../src/main/loaders/db-loader.js';
import GameDatabase from '../../../src/data-access/database/game-database.js';
import GameRepository from '../../../src/data-access/repositories/game-repository.js';

describe('Game Mongo Repository', () => {
  let connection = null;
  let gameCollection = null;

  beforeAll(async () => {
    // Get mongodb memory server url from env
    connection = await dbLoader(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    gameCollection = new GameDatabase();
    await gameCollection.deleteMany({});
  });

  const makeSut = () => {
    return new GameRepository(gameCollection);
  };

  test('Should create a game on success', async () => {
    const sut = makeSut();
    const game = await sut.create({
      title: 'Game test title',
      rating: 4.2,
      summary: 'Game test summary',
    });

    expect(game).toBeTruthy();
    expect(game.id).toBeTruthy();
    expect(game.title).toBe('Game test title');
    expect(game.rating).toBe(4.2);
    expect(game.summary).toBe('Game test summary');
  });

  test('Should get a game by id on success', async () => {
    const sut = makeSut();
    const game = await sut.create({
      title: 'Game test title',
      rating: 4.2,
      summary: 'Game test summary',
    });
    const gameGot = await sut.getById(game.id);

    expect(gameGot).toBeTruthy();
    expect(gameGot.id).toBeTruthy();
    expect(gameGot.id).toBe(game.id);
    expect(gameGot.title).toBe('Game test title');
    expect(gameGot.rating).toBe(4.2);
    expect(gameGot.summary).toBe('Game test summary');
  });

  test('Should get a game by title on success', async () => {
    const sut = makeSut();
    const game = await sut.create({
      title: 'Game test title',
      rating: 4.2,
      summary: 'Game test summary',
    });
    const gameGot = await sut.getByTitle('Game test title');

    expect(gameGot).toBeTruthy();
    expect(gameGot.id).toBeTruthy();
    expect(gameGot.id).toBe(game.id);
    expect(gameGot.title).toBe('Game test title');
    expect(gameGot.rating).toBe(4.2);
    expect(gameGot.summary).toBe('Game test summary');
  });

  test('Should get all games on success', async () => {
    const sut = makeSut();
    const game1 = await sut.create({
      title: 'Game test title 1',
      rating: 4.1,
      summary: 'Game test summary 1',
    });
    const game2 = await sut.create({
      title: 'Game test title 2',
      rating: 4.2,
      summary: 'Game test summary 2',
    });
    const gamesGot = await sut.getAll();

    expect(gamesGot[0]).toBeTruthy();
    expect(gamesGot[0].id).toBeTruthy();
    expect(gamesGot[0].id).toBe(game1.id);
    expect(gamesGot[0].title).toBe('Game test title 1');
    expect(gamesGot[0].rating).toBe(4.1);
    expect(gamesGot[0].summary).toBe('Game test summary 1');
    expect(gamesGot[1]).toBeTruthy();
    expect(gamesGot[1].id).toBeTruthy();
    expect(gamesGot[1].id).toBe(game2.id);
    expect(gamesGot[1].title).toBe('Game test title 2');
    expect(gamesGot[1].rating).toBe(4.2);
    expect(gamesGot[1].summary).toBe('Game test summary 2');
  });

  test('Should delete a game by id on success', async () => {
    const sut = makeSut();
    const game = await sut.create({
      title: 'Game test title',
      rating: 4.2,
      summary: 'Game test summary',
    });
    const res = await sut.deleteById(game.id);
    const gameGot = await sut.getById(game.id);

    expect(gameGot).toBeFalsy();
    expect(res).toBeTruthy();
    expect(res.deleted).toBeTruthy();
  });

  test('Should update a game on success', async () => {
    const sut = makeSut();
    const game = await sut.create({
      title: 'Game test title',
      rating: 4.2,
      summary: 'Game test summary',
    });
    const updatedGame = await sut.updateById(game.id, {
      title: 'Updated game title',
      rating: 4.3,
      summary: 'Updated game summary',
    });

    expect(updatedGame).toBeTruthy();
    expect(updatedGame.id).toBeTruthy();
    expect(updatedGame.title).toBe('Updated game title');
    expect(updatedGame.rating).toBe(4.3);
    expect(updatedGame.summary).toBe('Updated game summary');
  });
});
