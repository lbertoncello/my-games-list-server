import { MongooseHelper } from '../helpers/mongoose-helper.js';

export default class UserRepository {
  constructor(database) {
    this.database = database;
  }

  async create(user) {
    const result = await this.database(user).save();

    return MongooseHelper.map(result.toJSON());
  }

  async getById(id) {
    const result = await this.database.findById(id).lean();

    return MongooseHelper.map(result);
  }

  async getByEmail(email) {
    const result = await this.database.findOne({ email }).lean();

    return MongooseHelper.map(result);
  }

  async getByEmailWithPassword(email) {
    const result = await this.database.findOne({ email }).select('+password').lean();

    return MongooseHelper.map(result);
  }

  async getAll() {
    const result = await this.database.find().lean();

    return MongooseHelper.mapAll(result);
  }

  async updateById(id, fields) {
    const result = await this.database.findByIdAndUpdate(id, fields, { new: true, upsert: false }).lean();

    return MongooseHelper.map(result);
  }

  async deleteById(id) {
    const result = await this.database.deleteById(id);
    const deleted = result?.deletedCount > 0;

    return { deleted };
  }
}
