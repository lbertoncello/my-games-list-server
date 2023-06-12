import SignUpController from '../../presentation/controllers/auth/sign-up.js';
import SignInController from '../../presentation/controllers/auth/sign-in.js';
import SignOutController from '../../presentation/controllers/auth/sign-out.js';
import ChangePasswordController from '../../presentation/controllers/auth/change-password.js';
import SignUp from '../../use-cases/auth/sign-up.js';
import SignIn from '../../use-cases/auth/sign-in.js';
import SignOut from '../../use-cases/auth/sign-out.js';
import ChangePassword from '../../use-cases/auth/change-password.js';
import UserDatabase from '../../data-access/database/user-database.js';
import UserRepository from '../../data-access/repositories/user-repository.js';
import EmailValidatorAdapter from '../../presentation/validation/email-validator-adapter.js';
import PasswordValidatorAdapter from '../../presentation/validation/password-validator-adapter.js';
import BcryptAdapter from '../../data-access/auth/bcrypt-adapter.js';
import JwtAdapter from '../../data-access/auth/jwt-adapter.js';
import envConfig from '../config/env/env.js';

export const makeSignUpController = () => {
  const database = new UserDatabase();
  const repository = new UserRepository(database);
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const passwordValidatorAdapter = new PasswordValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter();
  const signUp = new SignUp(repository, bcryptAdapter);
  const controller = new SignUpController(signUp, emailValidatorAdapter, passwordValidatorAdapter);

  return controller;
};

export const makeSignInController = () => {
  const database = new UserDatabase();
  const repository = new UserRepository(database);
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter();
  const jwtAdapter = new JwtAdapter(envConfig.secrets.jwt, envConfig.secrets.jwtExp);
  const signIn = new SignIn(repository, bcryptAdapter, jwtAdapter);
  const controller = new SignInController(signIn, emailValidatorAdapter);

  return controller;
};

export const makeSignOutController = () => {
  const signOut = new SignOut();
  const controller = new SignOutController(signOut);

  return controller;
};

export const makeChangePasswordController = () => {
  const database = new UserDatabase();
  const repository = new UserRepository(database);
  const bcryptAdapter = new BcryptAdapter();
  const changePassword = new ChangePassword(repository, bcryptAdapter);
  const passwordValidatorAdapter = new PasswordValidatorAdapter();
  const controller = new ChangePasswordController(changePassword, passwordValidatorAdapter);

  return controller;
};
