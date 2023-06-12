import mongoose from 'mongoose';
import schema from '../schema/game-schema.js';

export default class GameDatabase {
  constructor() {
    return mongoose.model('games', schema);
  }
}
