import SuccessResponse from '../../responses/success-response.js';
import ClientError from '../../errors/client-error.js';

export default class GetMyUserDataController {
  constructor(getUser) {
    this.getUser = getUser;
  }

  async handle(req) {
    const signedUser = req.authUser;
    const user = await this.getUser.execute(signedUser);

    if (!user) throw new ClientError('It was not possible to retrieve the specified record', 400);

    return new SuccessResponse(user);
  }
}
