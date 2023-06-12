import HttpResponse from './http-response.js';

export default class SuccessResponse extends HttpResponse {
  constructor(data) {
    const success = true;
    super(success, data);
    this.status = 200;
  }
}
