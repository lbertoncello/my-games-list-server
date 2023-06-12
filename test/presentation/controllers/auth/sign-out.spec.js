import { jest } from '@jest/globals';
import SignOutController from '../../../../src/presentation/controllers/auth/sign-out.js';
import SuccessResponse from '../../../../src/presentation/responses/success-response.js';

const makeFakeSignOut = () => ({
  token: null,
});

const makeFakeRequest = () => ({
  body: {},
});

const makeSignOut = () => {
  class SignOutStub {
    async execute() {
      return await new Promise((resolve) => resolve(makeFakeSignOut()));
    }
  }

  return new SignOutStub();
};

const makeSut = () => {
  const signOutStub = makeSignOut();
  const sut = new SignOutController(signOutStub);

  return {
    sut,
    signOutStub,
  };
};

describe('Sign Out Controller', () => {
  test('Should execute the use case SignOut with correct values', async () => {
    const { sut, signOutStub } = makeSut();
    const signOutSpy = jest.spyOn(signOutStub, 'execute');
    await sut.handle(makeFakeRequest());

    expect(signOutSpy).toHaveBeenCalledWith();
  });

  test('Should throw an error if the use case SignOut throws', async () => {
    const { sut, signOutStub } = makeSut();
    jest.spyOn(signOutStub, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.handle(makeFakeRequest());

    expect(promise).rejects.toEqual(new Error());
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(new SuccessResponse(makeFakeSignOut()));
  });
});
