import { jest } from '@jest/globals';
import DeleteMyUser from '../../../../src/presentation/controllers/user/delete-my-user.js';
import SuccessResponse from '../../../../src/presentation/responses/success-response.js';
import ApplicationError from '../../../../src/presentation/errors/application-error.js';

const makeFakeDeleteMyUser = () => ({
  deleted: true,
});

const makeFakeRequest = () => ({
  authUser: {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
  },
});

const makeDeleteMyUser = () => {
  class DeleteMyUserStub {
    async execute(signedUser) {
      return await new Promise((resolve) => resolve(makeFakeDeleteMyUser()));
    }
  }

  return new DeleteMyUserStub();
};

const makeSut = () => {
  const deleteMyUserStub = makeDeleteMyUser();
  const sut = new DeleteMyUser(deleteMyUserStub);

  return {
    sut,
    deleteMyUserStub,
  };
};

describe('Delete My User Controller', () => {
  test('Should execute the use case DeleteMyUser with correct values', async () => {
    const { sut, deleteMyUserStub } = makeSut();
    const deleteMyUserSpy = jest.spyOn(deleteMyUserStub, 'execute');
    const fakeRequest = makeFakeRequest();
    await sut.handle(fakeRequest);

    expect(deleteMyUserSpy).toHaveBeenCalledWith(fakeRequest.authUser);
  });

  test('Should throw an error if the use case DeleteMyUser throws', async () => {
    const { sut, deleteMyUserStub } = makeSut();
    jest.spyOn(deleteMyUserStub, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.handle(makeFakeRequest());

    expect(promise).rejects.toEqual(new Error());
  });

  test('Should throw an error if the use case DeleteMyUser fails', async () => {
    const { sut, deleteMyUserStub } = makeSut();
    jest.spyOn(deleteMyUserStub, 'execute').mockResolvedValueOnce({
      deleted: false,
    });
    const promise = sut.handle(makeFakeRequest());

    expect(promise).rejects.toEqual(new ApplicationError('It was not possible to delete the specified record', 400));
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(new SuccessResponse(makeFakeDeleteMyUser()));
  });
});
