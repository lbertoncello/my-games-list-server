import _ from 'lodash';

export default class SignIn {
  constructor(repository, encrypter, tokenizer) {
    this.repository = repository;
    this.encrypter = encrypter;
    this.tokenizer = tokenizer;
  }

  async execute(email, password) {
    const normalizedEmail = email.toLowerCase();
    const dbUser = await this.repository.getByEmailWithPassword(normalizedEmail);

    if (!dbUser) {
      return null;
    }

    const passwordMatch = await this.encrypter.compare(password, dbUser.password);
    if (!passwordMatch) {
      return null;
    }

    const userWithoutPassword = _.omit(dbUser, 'password');
    const token = await this.tokenizer.tokenize(userWithoutPassword);

    return { token, user: userWithoutPassword };
  }
}
