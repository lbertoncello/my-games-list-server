import SuccessResponse from '../../responses/success-response.js';
import InvalidParamError from '../../errors/invalid-param-error.js';
import MissingParamError from '../../errors/missing-param-error.js';

export default class UpdateGameController {
  constructor(updateGame, floatValidator) {
    this.updateGame = updateGame;
    this.floatValidator = floatValidator;
  }

  async handle(req) {
    const { id } = req.params;
    if (!id) throw new MissingParamError('id');

    const allowedFields = ['title', 'rating', 'summary'];
    const gameData = {};
    // Filter only the allowed fields
    for (const allowedField of allowedFields) {
      if (req.body[allowedField]) {
        gameData[allowedField] = req.body[allowedField];
      }
    }

    if (Object.entries(gameData).length === 0) {
      throw new InvalidParamError('At least one field to update must be provided');
    }
    if (gameData.rating && !this.floatValidator.isValid(gameData.rating)) {
      throw new InvalidParamError("'rating' must be a float value");
    }

    const result = await this.updateGame.execute(id, gameData);

    return new SuccessResponse(result);
  }
}
