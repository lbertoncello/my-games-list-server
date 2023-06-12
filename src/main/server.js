import app from './app.js';
import dbLoader from './loaders/db-loader.js';
import logger from './config/logger/logger.js';
import envConfig from './config/env/env.js';

const start = async () => {
  try {
    await dbLoader();

    app.listen(envConfig.port, () => {
      logger.info('The server has been initialized...');
      logger.info(`API running on http://localhost:${envConfig.port}/api/v1`);
      logger.info(envConfig.dbUrl);
    });
  } catch (err) {
    logger.error('It was not possible to initialize the server', err);
  }
};

start();

process.on('unhandledRejection', (err, _) => {
  logger.error(`SERVER ERROR`, err);
});
