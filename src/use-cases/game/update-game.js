import fieldsFilter from '../../utils/fields-filter.js';

export default class UpdateGame {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id, gameData) {
    const allowedFieldNames = ['title', 'rating', 'summary'];
    const filteredFields = fieldsFilter(allowedFieldNames, gameData);
    const result = await this.repository.updateById(id, filteredFields);

    return result;
  }
}
