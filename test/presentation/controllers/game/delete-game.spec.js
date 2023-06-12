import { jest } from '@jest/globals';
import DeleteGame from '../../../../src/presentation/controllers/game/delete-game.js';
import SuccessResponse from '../../../../src/presentation/responses/success-response.js';
import ApplicationError from '../../../../src/presentation/errors/application-error.js';

const makeFakeDeleteGame = () => ({
  deleted: true,
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

const makeDeleteGame = () => {
  class DeleteGameStub {
    async execute(signedUser) {
      return await new Promise((resolve) => resolve(makeFakeDeleteGame()));
    }
  }

  return new DeleteGameStub();
};

const makeSut = () => {
  const deleteGameStub = makeDeleteGame();
  const sut = new DeleteGame(deleteGameStub);

  return {
    sut,
    deleteGameStub,
  };
};

describe('Delete Game By Id Controller', () => {
  test('Should execute the use case DeleteGame with correct values', async () => {
    const { sut, deleteGameStub } = makeSut();
    const deleteGameSpy = jest.spyOn(deleteGameStub, 'execute');
    const fakeRequest = makeFakeRequest();
    await sut.handle(fakeRequest);

    expect(deleteGameSpy).toHaveBeenCalledWith(fakeRequest.params.id);
  });

  test('Should throw an error if the use case DeleteGame throws', async () => {
    const { sut, deleteGameStub } = makeSut();
    jest.spyOn(deleteGameStub, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.handle(makeFakeRequest());

    expect(promise).rejects.toEqual(new Error());
  });

  test('Should throw an error if the use case DeleteGame fails', async () => {
    const { sut, deleteGameStub } = makeSut();
    jest.spyOn(deleteGameStub, 'execute').mockResolvedValueOnce({
      deleted: false,
    });
    const promise = sut.handle(makeFakeRequest());

    expect(promise).rejects.toEqual(new ApplicationError('It was not possible to delete the specified record', 400));
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(new SuccessResponse(makeFakeDeleteGame()));
  });
});
