import ApplicationErrorResponse from '../../presentation/responses/application-error-response.js';
import ServerErrorResponse from '../../presentation/responses/server-error-response.js';
// TODO add folder alias
import logger from '../config/logger/logger.js';

export default (err, req, res, next) => {
  if (err.status && err.status !== 500 && err.message) {
    logger.debug(err);
    const message = `${err.name}: ${err.message}`;

    res.status(err.status).json(new ApplicationErrorResponse(message));
  } else {
    logger.error(err);
    res.status(500).json(new ServerErrorResponse());
  }
};
