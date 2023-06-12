export default class GetGame {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id) {
    const game = await this.repository.getById(id);

    return game;
  }
}
