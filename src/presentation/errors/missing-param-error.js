export default class MissingParamError extends Error {
  constructor(paramName) {
    const message = `Parameter '${paramName}' is required`;
    super(message);
    this.status = 400;
    this.name = 'MissingParamError';
  }
}
