import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import JwtAdapter from '../../../src/data-access/auth/jwt-adapter.js';

const secret = 'any_secret';
const expire = '1h';
const makeSut = () => {
  const sut = new JwtAdapter(secret, expire);

  return sut;
};

describe('JWT Adapter', () => {
  test('Should call JWT sign with the correct values', async () => {
    const sut = makeSut();
    const signSpy = jest.spyOn(jwt, 'sign');
    const value = 'value';
    await sut.tokenize({ value });

    expect(signSpy).toHaveBeenCalledWith({ value }, secret, { expiresIn: expire });
  });

  test('Should return a token sign on success', async () => {
    const sut = makeSut();
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2YWx1ZSI6ImFueV92YWx1ZSJ9.lz5pVAHfZ0mj2YgGTWkmHfVIUliIlHxGRx9_Fo5tkVE';
    jest.spyOn(jwt, 'sign').mockResolvedValueOnce(token);
    const value = 'any_value';
    const result = await sut.tokenize({ value });

    expect(result).toBe(token);
  });

  test('Should throw if jwt adapter throws on tokenize', async () => {
    const sut = makeSut();
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.tokenize({ value: 'any_value' });

    expect(promise).rejects.toThrow();
  });

  test('Should call JWT verify with the correct values', async () => {
    const sut = makeSut();
    const verifySpy = jest.spyOn(jwt, 'verify');
    const token = 'any_token';
    await sut.verify(token);

    expect(verifySpy).toHaveBeenCalledWith(token, secret);
  });

  test('Should return a decoded token on verify on success', async () => {
    const sut = makeSut();
    const rawData = { value: 'any_value' };
    jest.spyOn(jwt, 'verify').mockImplementationOnce(async () => {
      return new Promise((resolve) => resolve(rawData));
    });
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2YWx1ZSI6ImFueV92YWx1ZSJ9.lz5pVAHfZ0mj2YgGTWkmHfVIUliIlHxGRx9_Fo5tkVE';
    const decodedToken = await sut.verify(token, secret);

    expect(decodedToken).toEqual(rawData);
  });

  test('Should return null if jwt adapter throws on verify', async () => {
    const sut = makeSut();
    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      throw new Error();
    });
    const result = await sut.verify('any_token');

    expect(result).toBeFalsy();
  });
});
