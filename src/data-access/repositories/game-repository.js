import { MongooseHelper } from '../helpers/mongoose-helper.js';

export default class GameRepository {
  constructor(database) {
    this.database = database;
  }

  async create(game) {
    const result = await this.database(game).save();

    return MongooseHelper.map(result.toJSON());
  }

  async getById(id) {
    const result = await this.database.findById(id).lean();

    return MongooseHelper.map(result);
  }

  async getByTitle(title) {
    const result = await this.database.findOne({ title }).lean();

    return MongooseHelper.map(result);
  }

  async getAll() {
    const result = await this.database.find().lean();

    return MongooseHelper.mapAll(result);
  }

  async deleteById(id) {
    const result = await this.database.deleteById(id);
    const deleted = result?.deletedCount > 0;

    return { deleted };
  }

  async updateById(id, fields) {
    const result = await this.database.findByIdAndUpdate(id, fields, { new: true, upsert: false }).lean();

    return MongooseHelper.map(result);
  }
}
