export default class ClientError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = 'ClientError';
  }
}
