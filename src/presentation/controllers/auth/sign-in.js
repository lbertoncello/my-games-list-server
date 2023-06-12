import SuccessResponse from '../../responses/success-response.js';
import InvalidParamError from '../../errors/invalid-param-error.js';
import MissingParamError from '../../errors/missing-param-error.js';
import ClientError from '../../errors/client-error.js';

export default class SignInController {
  constructor(signIn, emailValidator) {
    this.signIn = signIn;
    this.emailValidator = emailValidator;
  }

  async handle(req) {
    const requiredFields = ['email', 'password'];
    for (const requiredField of requiredFields) {
      if (!req.body[requiredField]) {
        throw new MissingParamError(requiredField);
      }
    }

    const { email, password } = req.body;

    const isEmailValid = this.emailValidator.isValid(email);
    if (!isEmailValid) throw new InvalidParamError("'email' is not valid");

    const result = await this.signIn.execute(email, password);
    if (!result) throw new ClientError('Password does not match or the user does not exist', 401);

    return new SuccessResponse(result);
  }
}
