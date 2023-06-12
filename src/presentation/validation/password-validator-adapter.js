import validator from 'validator';

export default class PasswordValidatorAdapter {
  isValid(value) {
    return validator.isStrongPassword(value);
  }
}
