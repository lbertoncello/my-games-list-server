export default class ChangePassword {
  constructor(repository, encrypter) {
    this.repository = repository;
    this.encrypter = encrypter;
  }

  response(updated, previousPasswordMatch) {
    return { updated, previousPasswordMatch };
  }

  async execute(signedUser, password, oldPassword) {
    const email = signedUser.email;
    const normalizedEmail = email.toLowerCase();
    const dbUser = await this.repository.getByEmailWithPassword(normalizedEmail);

    // Check if the user provided the correct old password
    const passwordMatch = await this.encrypter.compare(oldPassword, dbUser.password);
    if (!passwordMatch) {
      return this.response(false, false);
    }

    const id = signedUser.id;
    const encryptedPassword = await this.encrypter.encrypt(password);
    const result = await this.repository.updateById(id, { password: encryptedPassword });

    if (!result) return this.response(false, true);

    return this.response(true, true);
  }
}
