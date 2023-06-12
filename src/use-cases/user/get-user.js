export default class GetUser {
  constructor(repository) {
    this.repository = repository;
  }

  // It is only allowed to get the user signed in
  async execute(signedUser) {
    const id = signedUser.id;
    const result = await this.repository.getById(id);

    return result;
  }
}
