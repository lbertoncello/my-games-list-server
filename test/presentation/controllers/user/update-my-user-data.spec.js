import { jest } from '@jest/globals';
import UpdateMyUserDataController from '../../../../src/presentation/controllers/user/update-my-user-data.js';
import InvalidParamError from '../../../../src/presentation/errors/invalid-param-error.js';
import SuccessResponse from '../../../../src/presentation/responses/success-response.js';

const makeFakeUpdateMyUserData = () => ({
  user: {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
  },
});

const makeFakeRequest = () => ({
  body: {
    name: 'any_name',
  },
  authUser: {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
  },
});

const makeUpdateMyUserData = () => {
  class UpdateMyUserDataStub {
    async execute(signedUser, userData) {
      return await new Promise((resolve) => resolve(makeFakeUpdateMyUserData()));
    }
  }

  return new UpdateMyUserDataStub();
};

const makeSut = () => {
  const updateMyUserDataStub = makeUpdateMyUserData();
  const sut = new UpdateMyUserDataController(updateMyUserDataStub);

  return {
    sut,
    updateMyUserDataStub,
  };
};

describe('Update My User Data Controller', () => {
  test('Should return an error if no valid parameter is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        invalidParameter: 'any_value',
      },
    };
    const promise = sut.handle(httpRequest);

    expect(promise).rejects.toEqual(new InvalidParamError('At least one field to update must be provided'));
  });

  test('Should return an error if no parameter is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {},
    };
    const promise = sut.handle(httpRequest);

    expect(promise).rejects.toEqual(new InvalidParamError('At least one field to update must be provided'));
  });

  test('Should execute the use case UpdateMyUserData with correct values', async () => {
    const { sut, updateMyUserDataStub } = makeSut();
    const updateMyUserDataSpy = jest.spyOn(updateMyUserDataStub, 'execute');
    const fakeRequest = makeFakeRequest();
    await sut.handle(fakeRequest);

    expect(updateMyUserDataSpy).toHaveBeenCalledWith(fakeRequest.authUser, fakeRequest.body);
  });

  test('Should execute the use case UpdateMyUserData with allowed fields being passed', async () => {
    const { sut, updateMyUserDataStub } = makeSut();
    const updateMyUserDataSpy = jest.spyOn(updateMyUserDataStub, 'execute');
    const fakeRequest = {
      body: {
        name: 'any_name',
        invalidParameter: 'any_value',
      },
      authUser: {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
      },
    };
    const validParameters = {
      name: 'any_name',
    };
    await sut.handle(fakeRequest);

    expect(updateMyUserDataSpy).toHaveBeenCalledWith(fakeRequest.authUser, validParameters);
  });

  test('Should throw an error if the use case UpdateMyUserData throws', async () => {
    const { sut, updateMyUserDataStub } = makeSut();
    jest.spyOn(updateMyUserDataStub, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.handle(makeFakeRequest());

    expect(promise).rejects.toEqual(new Error());
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(new SuccessResponse(makeFakeUpdateMyUserData()));
  });
});
