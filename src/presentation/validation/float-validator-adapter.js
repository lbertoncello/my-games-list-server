import validator from 'validator';

export default class FloatValidatorAdapter {
  isValid(value) {
    return validator.isFloat(value);
  }
}
