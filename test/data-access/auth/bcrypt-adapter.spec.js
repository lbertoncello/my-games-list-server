import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';
import BcryptAdapter from '../../../src/data-access/auth/bcrypt-adapter.js';

const saltRounds = 10;
const makeSut = () => {
  const sut = new BcryptAdapter(saltRounds);

  return sut;
};

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt genSalt with correct values', async () => {
    const sut = makeSut();
    const genSaltSpy = jest.spyOn(bcrypt, 'genSalt');
    await sut.encrypt('any_value');

    expect(genSaltSpy).toHaveBeenCalledWith(saltRounds);
  });

  test('Should call bcrypt hash with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    jest.spyOn(bcrypt, 'genSalt').mockResolvedValueOnce('$2b$10$Xyl6MTOp4c6y6QrYmiK5G.');
    await sut.encrypt('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', '$2b$10$Xyl6MTOp4c6y6QrYmiK5G.');
  });

  test('Should return a hash on encrypt success', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => {
      return await new Promise((resolve) => resolve('hash'));
    });
    const hash = await sut.encrypt('any_value');

    expect(hash).toBe('hash');
  });

  test('Should throw if bcrypts throws in hash method', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.encrypt('any_value');

    await expect(promise).rejects.toThrow();
  });

  test('Should call bcrypt compare with correct values', async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    await sut.compare('any_value', 'any_encrypted_value');

    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_encrypted_value');
  });

  test('Should return true on compare success', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async (value, encryptedValue) => {
      return await new Promise((resolve) => resolve(value === encryptedValue));
    });
    const result = await sut.compare('any_value', 'any_value');

    expect(result).toBe(true);
  });

  test('Should return false on compare failure', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async (value, encryptedValue) => {
      return await new Promise((resolve) => resolve(value === encryptedValue));
    });
    const result = await sut.compare('any_value', 'other_value');

    expect(result).toBe(false);
  });

  test('Should throw if bcrypts throws in compare method', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.compare('any_value', 'any_encrypted_value');

    await expect(promise).rejects.toThrow();
  });
});
