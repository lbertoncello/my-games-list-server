import { jest } from '@jest/globals';
import AddGameController from '../../../../src/presentation/controllers/game/add-game.js';
import MissingParamError from '../../../../src/presentation/errors/missing-param-error.js';
import SuccessResponse from '../../../../src/presentation/responses/success-response.js';
import InvalidParamError from '../../../../src/presentation/errors/invalid-param-error.js';

const makeFakeAddGameResponse = () => ({
  id: 'valid_id',
  title: 'valid_title',
  rating: 1,
  summary: 'valid_summary',
});

const makeFakeRequest = () => ({
  body: {
    title: 'any_title',
    rating: 1,
    summary: 'any_summary',
  },
  authUser: {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
  },
});

const makeFloatValidatorStub = () => {
  class FloatValidatorStub {
    isValid(value) {
      return true;
    }
  }

  return new FloatValidatorStub();
};

const makeAddGame = () => {
  class AddGameStub {
    async execute(gameData) {
      return await new Promise((resolve) => resolve(makeFakeAddGameResponse()));
    }
  }

  return new AddGameStub();
};

const makeSut = () => {
  const addGameStub = makeAddGame();
  const floatValidatorStub = makeFloatValidatorStub();
  const sut = new AddGameController(addGameStub, floatValidatorStub);

  return {
    sut,
    addGameStub,
    floatValidatorStub,
  };
};

describe('Add Game Controller', () => {
  test('Should return an error if no title is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        rating: 1,
        summary: 'any_summary',
      },
    };
    const promise = sut.handle(httpRequest);

    expect(promise).rejects.toEqual(new MissingParamError('title'));
  });

  test('Should return an error if no rating is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        title: 'any_title',
        summary: 'any_summary',
      },
    };
    const promise = sut.handle(httpRequest);

    expect(promise).rejects.toEqual(new MissingParamError('rating'));
  });

  test('Should return an error if no summary is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        title: 'any_title',
        rating: 1,
      },
    };
    const promise = sut.handle(httpRequest);

    expect(promise).rejects.toEqual(new MissingParamError('summary'));
  });

  test('Should return an error if rating has the wrong type', async () => {
    const { sut, floatValidatorStub } = makeSut();
    const httpRequest = {
      body: {
        title: 'any_title',
        rating: 'any_string',
        summary: 'any_summary',
      },
    };
    jest.spyOn(floatValidatorStub, 'isValid').mockReturnValueOnce(false);
    const promise = sut.handle(httpRequest);

    expect(promise).rejects.toEqual(new InvalidParamError("'rating' must be a float value"));
  });

  test('Should call FloatValidator with correct value', async () => {
    const { sut, floatValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(floatValidatorStub, 'isValid');
    const fakeRequest = makeFakeRequest();
    await sut.handle(fakeRequest);

    expect(isValidSpy).toHaveBeenCalledWith(fakeRequest.body.rating);
  });

  test('Should throw an error if FloatValidator throws', async () => {
    const { sut, floatValidatorStub } = makeSut();
    jest.spyOn(floatValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.handle(makeFakeRequest());

    expect(promise).rejects.toEqual(new Error());
  });

  test('Should execute the use case AddGame with correct values', async () => {
    const { sut, addGameStub } = makeSut();
    const addGameSpy = jest.spyOn(addGameStub, 'execute');
    await sut.handle(makeFakeRequest());

    expect(addGameSpy).toHaveBeenCalledWith({
      title: 'any_title',
      rating: 1,
      summary: 'any_summary',
    });
  });

  test('Should throw an error if the use case AddGame throws', async () => {
    const { sut, addGameStub } = makeSut();
    jest.spyOn(addGameStub, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.handle(makeFakeRequest());

    expect(promise).rejects.toEqual(new Error());
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(new SuccessResponse(makeFakeAddGameResponse()));
  });
});
