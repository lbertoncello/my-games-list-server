import jwt from 'jsonwebtoken';

export default class JwtAdapter {
  constructor(secret, expire) {
    this.secret = secret;
    this.expire = expire;
  }

  async tokenize(value) {
    const token = await jwt.sign(value, this.secret, { expiresIn: this.expire });

    return token;
  }

  async verify(token) {
    try {
      const decodedToken = await jwt.verify(token, this.secret);

      return decodedToken;
    } catch (err) {
      return null;
    }
  }
}
