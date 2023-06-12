import { jest } from '@jest/globals';
import ChangePasswordController from '../../../../src/presentation/controllers/auth/change-password.js';
import MissingParamError from '../../../../src/presentation/errors/missing-param-error.js';
import InvalidParamError from '../../../../src/presentation/errors/invalid-param-error.js';
import ClientError from '../../../../src/presentation/errors/client-error.js';
import ApplicationError from '../../../../src/presentation/errors/application-error.js';
import SuccessResponse from '../../../../src/presentation/responses/success-response.js';

const makeFakeChangePassword = () => ({
  updated: true,
  previousPasswordMatch: true,
});

const makeFakeRequest = () => ({
  body: {
    password: 'any_password',
    passwordConfirmation: 'any_password',
    oldPassword: 'old_password',
  },
  authUser: {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
  },
});

const makeChangePassword = () => {
  class ChangePasswordStub {
    async execute(signedUser, password, oldPassword) {
      return await new Promise((resolve) => resolve(makeFakeChangePassword()));
    }
  }

  return new ChangePasswordStub();
};

const makePasswordValidator = () => {
  class PasswordValidatorStub {
    isValid(value) {
      return true;
    }
  }

  return new PasswordValidatorStub();
};

const makeSut = () => {
  const changePasswordStub = makeChangePassword();
  const passwordValidatorStub = makePasswordValidator();
  const sut = new ChangePasswordController(changePasswordStub, passwordValidatorStub);

  return {
    sut,
    changePasswordStub,
    passwordValidatorStub,
  };
};

describe('Change Password Controller', () => {
  test('Should return an error if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        passwordConfirmation: 'any_password',
        oldPassword: 'old_password',
      },
    };
    const promise = sut.handle(httpRequest);

    expect(promise).rejects.toEqual(new MissingParamError('password'));
  });

  test('Should return an error if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password',
        oldPassword: 'old_password',
      },
    };
    const promise = sut.handle(httpRequest);

    expect(promise).rejects.toEqual(new MissingParamError('passwordConfirmation'));
  });

  test('Should return an error if no oldPassword is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const promise = sut.handle(httpRequest);

    expect(promise).rejects.toEqual(new MissingParamError('oldPassword'));
  });

  test('Should return an error if the passwords does not match', async () => {
    const { sut, changePasswordStub } = makeSut();
    // When the password does not match, false will be returned
    jest.spyOn(changePasswordStub, 'execute').mockResolvedValueOnce(false);
    const httpRequest = {
      body: {
        password: 'any_password',
        passwordConfirmation: 'any_other_password',
        oldPassword: 'any_password',
      },
    };
    const promise = sut.handle(httpRequest);

    expect(promise).rejects.toEqual(new InvalidParamError('The password does not match the password confirmation'));
  });

  test('Should return an error if oldPassword does not match', async () => {
    const { sut, changePasswordStub } = makeSut();
    // When the password does not match, false will be returned
    jest.spyOn(changePasswordStub, 'execute').mockResolvedValueOnce(false);
    const httpRequest = {
      body: {
        password: 'any_password',
        passwordConfirmation: 'any_password',
        oldPassword: 'wrong_password',
      },
    };
    const promise = sut.handle(httpRequest);

    expect(promise).rejects.toEqual(new ClientError('The previous password does not match the password provided', 401));
  });

  test('Should return an error if a weak is provided', async () => {
    const { sut, passwordValidatorStub } = makeSut();
    jest.spyOn(passwordValidatorStub, 'isValid').mockReturnValueOnce(false);
    const promise = sut.handle(makeFakeRequest());

    expect(promise).rejects.toEqual(new InvalidParamError('Your password must be stronger'));
  });

  test('Should call PasswordValidator with correct password', async () => {
    const { sut, passwordValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(passwordValidatorStub, 'isValid');
    const fakeRequest = makeFakeRequest();
    await sut.handle(fakeRequest);

    expect(isValidSpy).toHaveBeenCalledWith(fakeRequest.body.password);
  });

  test('Should throw an error if PasswordValidator throws', async () => {
    const { sut, passwordValidatorStub } = makeSut();
    jest.spyOn(passwordValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.handle(makeFakeRequest());

    expect(promise).rejects.toEqual(new Error());
  });

  test('Should execute the use case ChangePassword with correct values', async () => {
    const { sut, changePasswordStub } = makeSut();
    const changePasswordSpy = jest.spyOn(changePasswordStub, 'execute');
    const fakeRequest = makeFakeRequest();
    await sut.handle(fakeRequest);

    expect(changePasswordSpy).toHaveBeenCalledWith(
      fakeRequest.authUser,
      fakeRequest.body.password,
      fakeRequest.body.oldPassword
    );
  });

  test('Should throw an error if the use case ChangePassword throws', async () => {
    const { sut, changePasswordStub } = makeSut();
    jest.spyOn(changePasswordStub, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.handle(makeFakeRequest());

    expect(promise).rejects.toEqual(new Error());
  });

  test('Should throw an error if ChangePassword was not able to change the password', async () => {
    const { sut, changePasswordStub } = makeSut();
    jest.spyOn(changePasswordStub, 'execute').mockResolvedValueOnce({
      previousPasswordMatch: true,
      updated: false,
    });
    const promise = sut.handle(makeFakeRequest());

    expect(promise).rejects.toEqual(new ApplicationError('It was not possible to change your password'));
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(new SuccessResponse(makeFakeChangePassword()));
  });
});
