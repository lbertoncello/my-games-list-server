export default class DeleteUser {
  constructor(repository) {
    this.repository = repository;
  }

  // It is only allowed to delete the user signed in
  async execute(signedUser) {
    const id = signedUser.id;
    const result = await this.repository.deleteById(id);

    return result;
  }
}
