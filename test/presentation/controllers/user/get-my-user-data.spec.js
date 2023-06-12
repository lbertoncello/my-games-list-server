import { jest } from '@jest/globals';
import GetMyUserDataController from '../../../../src/presentation/controllers/user/get-my-user-data.js';
import SuccessResponse from '../../../../src/presentation/responses/success-response.js';

const makeFakeGetMyUserData = () => ({
  user: {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
  },
});

const makeFakeRequest = () => ({
  authUser: {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
  },
});

const makeGetMyUserData = () => {
  class GetMyUserDataStub {
    async execute(signedUser) {
      return await new Promise((resolve) => resolve(makeFakeGetMyUserData()));
    }
  }

  return new GetMyUserDataStub();
};

const makeSut = () => {
  const GetMyUserDataStub = makeGetMyUserData();
  const sut = new GetMyUserDataController(GetMyUserDataStub);

  return {
    sut,
    GetMyUserDataStub,
  };
};

describe('Get My User Data Controller', () => {
  test('Should execute the use case GetMyUserData with correct values', async () => {
    const { sut, GetMyUserDataStub } = makeSut();
    const GetMyUserDataSpy = jest.spyOn(GetMyUserDataStub, 'execute');
    const fakeRequest = makeFakeRequest();
    await sut.handle(fakeRequest);

    expect(GetMyUserDataSpy).toHaveBeenCalledWith(fakeRequest.authUser);
  });

  test('Should throw an error if the use case GetMyUserData throws', async () => {
    const { sut, GetMyUserDataStub } = makeSut();
    jest.spyOn(GetMyUserDataStub, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.handle(makeFakeRequest());

    expect(promise).rejects.toEqual(new Error());
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(new SuccessResponse(makeFakeGetMyUserData()));
  });
});
