import mongoose from 'mongoose';
import schema from '../schema/user-schema.js';

export default class UserDatabase {
  constructor() {
    return mongoose.model('users', schema);
  }
}
