import SuccessResponse from '../../responses/success-response.js';

export default class GetAllGamesController {
  constructor(getAllGames) {
    this.getAllGames = getAllGames;
  }

  async handle(req) {
    const games = await this.getAllGames.execute();

    return new SuccessResponse(games);
  }
}
