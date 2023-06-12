import mongoose from 'mongoose';
import envConfig from '../config/env/env.js';
import logger from '../config/logger/logger.js';

export default async (url = envConfig.dbUrl, opts = {}) => {
  try {
    const dbOptions = { ...opts, useNewUrlParser: true, useUnifiedTopology: true };
    await mongoose.connect(url, dbOptions);
    const connection = mongoose.connection;

    logger.info('MongoDB has been initialized...');

    return connection;
  } catch (err) {
    logger.error('DB initialization ERROR', err);
    throw err;
  }
};
