import HttpResponse from './http-response.js';

export default class ServerErrorResponse extends HttpResponse {
  constructor() {
    const success = false;
    const data = {};

    super(success, data);
    this.body.message = `Internal Server Error`;
  }
}
