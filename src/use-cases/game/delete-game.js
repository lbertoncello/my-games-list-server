export default class DeleteGame {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id) {
    const result = await this.repository.deleteById(id);

    return result;
  }
}
