import SuccessResponse from '../../responses/success-response.js';
import InvalidParamError from '../../errors/invalid-param-error.js';
import MissingParamError from '../../errors/missing-param-error.js';
import ApplicationError from '../../errors/application-error.js';
import ClientError from '../../errors/client-error.js';

export default class ChangePasswordController {
  constructor(changePassword, passwordValidatorAdapter) {
    this.changePassword = changePassword;
    this.passwordValidatorAdapter = passwordValidatorAdapter;
  }

  async handle(req) {
    const requiredFields = ['password', 'passwordConfirmation', 'oldPassword'];
    for (const requiredField of requiredFields) {
      if (!req.body[requiredField]) {
        throw new MissingParamError(requiredField);
      }
    }

    const { password, passwordConfirmation, oldPassword } = req.body;
    if (password !== passwordConfirmation)
      throw new InvalidParamError('The password does not match the password confirmation');

    const isPasswordValid = this.passwordValidatorAdapter.isValid(password);
    if (!isPasswordValid) throw new InvalidParamError('Your password must be stronger');

    const signedUser = req.authUser;
    const result = await this.changePassword.execute(signedUser, password, oldPassword);

    if (!result.previousPasswordMatch)
      throw new ClientError('The previous password does not match the password provided', 401);

    if (!result.updated) throw new ApplicationError('It was not possible to change your password');

    return new SuccessResponse(result);
  }
}
