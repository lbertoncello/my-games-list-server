import HttpResponse from './http-response.js';

export default class ApplicationErrorResponse extends HttpResponse {
  constructor(message) {
    const success = false;
    const data = {};

    super(success, data);
    this.body.message = message;
  }
}
