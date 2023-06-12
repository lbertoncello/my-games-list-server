import bcrypt from 'bcrypt';

export default class BcryptAdapter {
  constructor(saltRounds = 10) {
    this.saltRounds = saltRounds;
  }

  async encrypt(value) {
    const salt = await bcrypt.genSalt(this.saltRounds);
    const hash = await bcrypt.hash(value, salt);

    return hash;
  }

  async compare(value, encryptedValue) {
    return await bcrypt.compare(value, encryptedValue);
  }
}
