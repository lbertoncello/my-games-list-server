import GetUser from '../../use-cases/user/get-user.js';
import UpdateUser from '../../use-cases/user/update-user.js';
import DeleteUser from '../../use-cases/user/delete-user.js';
import GetMyUserDataController from '../../presentation/controllers/user/get-my-user-data.js';
import UpdateMyUserDataController from '../../presentation/controllers/user/update-my-user-data.js';
import DeleteMyUserController from '../../presentation/controllers/user/delete-my-user.js';
import UserDatabase from '../../data-access/database/user-database.js';
import UserRepository from '../../data-access/repositories/user-repository.js';

export const makeGetMyUserDataController = () => {
  const database = new UserDatabase();
  const repository = new UserRepository(database);
  const getUser = new GetUser(repository);
  const controller = new GetMyUserDataController(getUser);

  return controller;
};

export const makeUpdateMyUserDataController = () => {
  const database = new UserDatabase();
  const repository = new UserRepository(database);
  const updateUser = new UpdateUser(repository);
  const controller = new UpdateMyUserDataController(updateUser);

  return controller;
};

export const makeDeleteMyUserController = () => {
  const database = new UserDatabase();
  const repository = new UserRepository(database);
  const deleteUser = new DeleteUser(repository);
  const controller = new DeleteMyUserController(deleteUser);

  return controller;
};
