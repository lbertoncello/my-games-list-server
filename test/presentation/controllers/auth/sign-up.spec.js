import { jest } from '@jest/globals';
import SignUpController from '../../../../src/presentation/controllers/auth/sign-up.js';
import MissingParamError from '../../../../src/presentation/errors/missing-param-error.js';
import InvalidParamError from '../../../../src/presentation/errors/invalid-param-error.js';
import SuccessResponse from '../../../../src/presentation/responses/success-response.js';

const makeFakeUser = () => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
});

const makeFakeRequest = () => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
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

const makePasswordValidator = () => {
  class PasswordValidatorStub {
    isValid(value) {
      return true;
    }
  }

  return new PasswordValidatorStub();
};

const makeSignUp = () => {
  class SignUpStub {
    async execute(name, email, password) {
      return await new Promise((resolve) => resolve(makeFakeUser()));
    }
  }

  return new SignUpStub();
};

const makeSut = () => {
  const signUpStub = makeSignUp();
  const emailValidatorStub = makeEmailValidator();
  const passwordValidatorStub = makePasswordValidator();
  const sut = new SignUpController(signUpStub, emailValidatorStub, passwordValidatorStub);

  return {
    sut,
    signUpStub,
    emailValidatorStub,
    passwordValidatorStub,
  };
};

describe('Sign Up Controller', () => {
  test('Should return an error if no name is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const promise = sut.handle(httpRequest);

    expect(promise).rejects.toEqual(new MissingParamError('name'));
  });

  test('Should return an error if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'valid_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const promise = sut.handle(httpRequest);

    expect(promise).rejects.toEqual(new MissingParamError('email'));
  });

  test('Should return an error if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        passwordConfirmation: 'any_password',
      },
    };
    const promise = sut.handle(httpRequest);

    expect(promise).rejects.toEqual(new MissingParamError('password'));
  });

  test('Should return an error if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'any_password',
      },
    };
    const promise = sut.handle(httpRequest);

    expect(promise).rejects.toEqual(new MissingParamError('passwordConfirmation'));
  });

  test('Should return an error if password confirmation fails', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password',
      },
    };
    const promise = sut.handle(httpRequest);

    expect(promise).rejects.toEqual(new InvalidParamError('The password does not match the password confirmation'));
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

  test('Should execute the use case SignUp with correct values', async () => {
    const { sut, signUpStub } = makeSut();
    const signUpSpy = jest.spyOn(signUpStub, 'execute');
    await sut.handle(makeFakeRequest());

    expect(signUpSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });
  });

  test('Should throw an error if the use case SignUp throws', async () => {
    const { sut, signUpStub } = makeSut();
    jest.spyOn(signUpStub, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.handle(makeFakeRequest());

    expect(promise).rejects.toEqual(new Error());
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(new SuccessResponse(makeFakeUser()));
  });
});
