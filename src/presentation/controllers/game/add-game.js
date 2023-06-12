import SuccessResponse from '../../responses/success-response.js';
import MissingParamError from '../../errors/missing-param-error.js';
import InvalidParamError from '../../errors/invalid-param-error.js';

export default class AddGameController {
  constructor(addGame, floatValidator) {
    this.addGame = addGame;
    this.floatValidator = floatValidator;
  }

  async handle(req) {
    const requiredFielsd = ['title', 'rating', 'summary'];
    for (const requiredField of requiredFielsd) {
      if (!req.body[requiredField]) {
        throw new MissingParamError(requiredField);
      }
    }
    const { title, rating, summary } = req.body;

    const ratingValid = this.floatValidator.isValid(rating);
    if (!ratingValid) throw new InvalidParamError("'rating' must be a float value");

    const result = await this.addGame.execute({ title, rating, summary });

    return new SuccessResponse(result);
  }
}
