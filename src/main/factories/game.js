import AddGameController from '../../presentation/controllers/game/add-game.js';
import GetGameController from '../../presentation/controllers/game/get-game.js';
import GetAllGamesController from '../../presentation/controllers/game/get-all-games.js';
import UpdateGameController from '../../presentation/controllers/game/update-game.js';
import DeleteGameController from '../../presentation/controllers/game/delete-game.js';
import AddGame from '../../use-cases/game/add-game.js';
import GetGame from '../../use-cases/game/get-game.js';
import GetAllGames from '../../use-cases/game/get-all-games.js';
import UpdateGame from '../../use-cases/game/update-game.js';
import DeleteGame from '../../use-cases/game/delete-game.js';
import GameDatabase from '../../data-access/database/game-database.js';
import GameRepository from '../../data-access/repositories/game-repository.js';
import FloatValidatorAdapter from '../../presentation/validation/float-validator-adapter.js';

export const makeAddGameController = () => {
  const database = new GameDatabase();
  const repository = new GameRepository(database);
  const addGame = new AddGame(repository);
  const floatValidatorAdapter = new FloatValidatorAdapter();
  const controller = new AddGameController(addGame, floatValidatorAdapter);

  return controller;
};

export const makeGetGameController = () => {
  const database = new GameDatabase();
  const repository = new GameRepository(database);
  const getGame = new GetGame(repository);
  const controller = new GetGameController(getGame);

  return controller;
};

export const makeGetAllGamesController = () => {
  const database = new GameDatabase();
  const repository = new GameRepository(database);
  const getAllGames = new GetAllGames(repository);
  const controller = new GetAllGamesController(getAllGames);

  return controller;
};

export const makeUpdateGameController = () => {
  const database = new GameDatabase();
  const repository = new GameRepository(database);
  const updateGame = new UpdateGame(repository);
  const floatValidatorAdapter = new FloatValidatorAdapter();
  const controller = new UpdateGameController(updateGame, floatValidatorAdapter);

  return controller;
};

export const makeDeleteGameController = () => {
  const database = new GameDatabase();
  const repository = new GameRepository(database);
  const deleteGame = new DeleteGame(repository);
  const controller = new DeleteGameController(deleteGame);

  return controller;
};
