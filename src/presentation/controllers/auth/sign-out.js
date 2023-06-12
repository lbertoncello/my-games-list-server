import SuccessResponse from '../../responses/success-response.js';

export default class SignOutController {
  constructor(signOut) {
    this.signOut = signOut;
  }

  async handle(req) {
    const result = await this.signOut.execute();

    return new SuccessResponse(result);
  }
}
