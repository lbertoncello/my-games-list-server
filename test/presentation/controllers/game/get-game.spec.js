import { jest } from '@jest/globals';
import GetGameController from '../../../../src/presentation/controllers/game/get-game.js';
import ClientError from '../../../../src/presentation/errors/client-error.js';
import SuccessResponse from '../../../../src/presentation/responses/success-response.js';

const makeFakeGetGameResponse = () => ({
  id: 'valid_id',
  title: 'valid_title',
  rating: 1,
  summary: 'valid_summary',
});

const makeFakeRequest = () => ({
  params: {
    id: 'valid_id',
  },
  authUser: {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
  },
});

const makeGetGame = () => {
  class GetGameStub {
    async execute(id) {
      return await new Promise((resolve) => resolve(makeFakeGetGameResponse()));
    }
  }

  return new GetGameStub();
};

const makeSut = () => {
  const getGameStub = makeGetGame();
  const sut = new GetGameController(getGameStub);

  return {
    sut,
    getGameStub,
  };
};

describe('Get Game By Id Controller', () => {
  test('Should return an error if there is no record with the provided id', async () => {
    const { sut, getGameStub } = makeSut();
    const httpRequest = {
      params: {
        id: 'invalid_id',
      },
    };
    jest.spyOn(getGameStub, 'execute').mockResolvedValueOnce(false);
    const promise = sut.handle(httpRequest);

    expect(promise).rejects.toEqual(new ClientError('It was not possible to retrieve the specified record', 400));
  });

  test('Should execute the use case GetGame with correct values', async () => {
    const { sut, getGameStub } = makeSut();
    const getGameSpy = jest.spyOn(getGameStub, 'execute');
    const fakeRequest = makeFakeRequest();
    await sut.handle(fakeRequest);

    expect(getGameSpy).toHaveBeenCalledWith(fakeRequest.params.id);
  });

  test('Should throw an error if the use case GetGame throws', async () => {
    const { sut, getGameStub } = makeSut();
    jest.spyOn(getGameStub, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.handle(makeFakeRequest());

    expect(promise).rejects.toEqual(new Error());
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(new SuccessResponse(makeFakeGetGameResponse()));
  });
});
