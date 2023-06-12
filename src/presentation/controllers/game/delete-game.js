import SuccessResponse from '../../responses/success-response.js';
import MissingParamError from '../../errors/missing-param-error.js';
import ClientError from '../../errors/client-error.js';

export default class DeleteGameController {
  constructor(deleteGame) {
    this.deleteGame = deleteGame;
  }

  async handle(req) {
    const { id } = req.params;
    if (!id) throw new MissingParamError('id');

    const result = await this.deleteGame.execute(id);

    if (!result.deleted) throw new ClientError('It was not possible to delete the specified record', 400);
    return new SuccessResponse(result);
  }
}
