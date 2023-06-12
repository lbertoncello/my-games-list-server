export default class InvalidParamError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
    this.name = 'InvalidParamError';
  }
}
