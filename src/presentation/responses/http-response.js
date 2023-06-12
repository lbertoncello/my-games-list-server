export default class HttpResponse {
  constructor(success, data) {
    this.body = {
      success,
      data,
    };
  }
}
