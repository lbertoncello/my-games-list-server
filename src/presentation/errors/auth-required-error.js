export default class AuthRequiredError extends Error {
  constructor(message = 'You must be signed in to complete this request') {
    super(message);
    this.status = 401;
    this.name = 'AuthRequiredError';
  }
}
