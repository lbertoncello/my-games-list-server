export default class GetAllGames {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    const games = await this.repository.getAll();

    return games;
  }
}
