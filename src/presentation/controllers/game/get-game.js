import SuccessResponse from '../../responses/success-response.js';
import MissingParamError from '../../errors/missing-param-error.js';
import ClientError from '../../errors/client-error.js';

export default class GetGameController {
  constructor(getGame) {
    this.getGame = getGame;
  }

  async handle(req) {
    const { id } = req.params;
    if (!id) throw new MissingParamError('id');

    const game = await this.getGame.execute(id);

    if (!game) throw new ClientError('It was not possible to retrieve the specified record', 400);

    return new SuccessResponse(game);
  }
}
