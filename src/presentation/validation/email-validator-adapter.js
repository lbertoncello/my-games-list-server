import validator from 'validator';

export default class EmailValidatorAdapter {
  isValid(email) {
    return validator.isEmail(email);
  }
}
