import { jest } from '@jest/globals';
import SignInController from '../../../../src/presentation/controllers/auth/sign-in.js';
import MissingParamError from '../../../../src/presentation/errors/missing-param-error.js';
import InvalidParamError from '../../../../src/presentation/errors/invalid-param-error.js';
import ClientError from '../../../../src/presentation/errors/client-error.js';
import SuccessResponse from '../../../../src/presentation/responses/success-response.js';

const makeFakeSignIn = () => ({
  token: 'valid_token',
  user: {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
  },
});

const makeFakeRequest = () => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password',
  },
});

const makeEmailValidator = () => {
  class EmailValidatorStub {
    isValid(account) {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeSignIn = () => {
  class SignInStub {
    async execute(email, password) {
      return await new Promise((resolve) => resolve(makeFakeSignIn()));
    }
  }

  return new SignInStub();
};

const makeSut = () => {
  const signInStub = makeSignIn();
  const emailValidatorStub = makeEmailValidator();
  const sut = new SignInController(signInStub, emailValidatorStub);

  return {
    sut,
    signInStub,
    emailValidatorStub,
  };
};

describe('Sign In Controller', () => {
  test('Should return an error if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };
    const promise = sut.handle(httpRequest);

    expect(promise).rejects.toEqual(new MissingParamError('email'));
  });

  test('Should return an error if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'valid_email@mail.com',
      },
    };
    const promise = sut.handle(httpRequest);

    expect(promise).rejects.toEqual(new MissingParamError('password'));
  });

  test('Should return an error if the password does not match', async () => {
    const { sut, signInStub } = makeSut();
    // When the password does not match, false will be returned
    jest.spyOn(signInStub, 'execute').mockResolvedValueOnce(false);
    const httpRequest = {
      body: {
        email: 'valid_email@mail.com',
        password: 'wrong_password',
      },
    };
    const promise = sut.handle(httpRequest);

    expect(promise).rejects.toEqual(new ClientError('Password does not match or the user does not exist', 401));
  });

  test('Should return an error if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const promise = sut.handle(makeFakeRequest());

    expect(promise).rejects.toEqual(new InvalidParamError("'email' is not valid"));
  });

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    const fakeRequest = makeFakeRequest();
    await sut.handle(fakeRequest);

    expect(isValidSpy).toHaveBeenCalledWith(fakeRequest.body.email);
  });

  test('Should throw an error if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.handle(makeFakeRequest());

    expect(promise).rejects.toEqual(new Error());
  });

  test('Should execute the use case SignIn with correct values', async () => {
    const { sut, signInStub } = makeSut();
    const signInSpy = jest.spyOn(signInStub, 'execute');
    await sut.handle(makeFakeRequest());

    expect(signInSpy).toHaveBeenCalledWith('any_email@mail.com', 'any_password');
  });

  test('Should throw an error if the use case SignIn throws', async () => {
    const { sut, signInStub } = makeSut();
    jest.spyOn(signInStub, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.handle(makeFakeRequest());

    expect(promise).rejects.toEqual(new Error());
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(new SuccessResponse(makeFakeSignIn()));
  });
});
