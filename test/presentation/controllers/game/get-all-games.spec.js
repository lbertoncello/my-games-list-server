import { jest } from '@jest/globals';
import GetAllGamesController from '../../../../src/presentation/controllers/game/get-all-games.js';
import SuccessResponse from '../../../../src/presentation/responses/success-response.js';

const makeFakeGetAllGamesResponse = () => [
  {
    id: 'valid_id_1',
    title: 'valid_title_1',
    rating: 1,
    summary: 'valid_summary_1',
  },
  {
    id: 'valid_id_2',
    title: 'valid_title_2',
    rating: 2,
    summary: 'valid_summary_2',
  },
];

const makeFakeRequest = () => ({
  authUser: {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
  },
});

const makeGetAllGames = () => {
  class GetAllGamesStub {
    async execute(id) {
      return await new Promise((resolve) => resolve(makeFakeGetAllGamesResponse()));
    }
  }

  return new GetAllGamesStub();
};

const makeSut = () => {
  const getAllGamesStub = makeGetAllGames();
  const sut = new GetAllGamesController(getAllGamesStub);

  return {
    sut,
    getAllGamesStub,
  };
};

describe('Get All Games Controller', () => {
  test('Should execute the use case GetAllGames with correct values', async () => {
    const { sut, getAllGamesStub } = makeSut();
    const getAllGamesSpy = jest.spyOn(getAllGamesStub, 'execute');
    const fakeRequest = makeFakeRequest();
    await sut.handle(fakeRequest);

    expect(getAllGamesSpy).toHaveBeenCalledWith();
  });

  test('Should throw an error if the use case GetAllGames throws', async () => {
    const { sut, getAllGamesStub } = makeSut();
    jest.spyOn(getAllGamesStub, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.handle(makeFakeRequest());

    expect(promise).rejects.toEqual(new Error());
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(new SuccessResponse(makeFakeGetAllGamesResponse()));
  });
});
