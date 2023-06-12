import SuccessResponse from '../../responses/success-response.js';
import InvalidParamError from '../../errors/invalid-param-error.js';

export default class UpdateMyUserDataController {
  constructor(updateUser) {
    this.updateUser = updateUser;
  }

  async handle(req) {
    const allowedFields = ['name'];
    const userData = {};
    for (const allowedField of allowedFields) {
      if (req.body[allowedField]) {
        userData[allowedField] = req.body[allowedField];
      }
    }

    if (Object.entries(userData).length === 0) {
      throw new InvalidParamError('At least one field to update must be provided');
    }

    const signedUser = req.authUser;
    const updatedUser = await this.updateUser.execute(signedUser, userData);

    return new SuccessResponse(updatedUser);
  }
}
