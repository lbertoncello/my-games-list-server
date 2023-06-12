import Game from '../../entities/game.js';

export default class AddGame {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(gameData) {
    const { title, rating, summary } = gameData;
    const game = new Game(title, rating, summary);

    return await this.repository.create(game);
  }
}
