import morgan from 'morgan';
import envConfig from './env/env.js';
import { rateLimiter } from '../middlewares/middlewares.js';
import routes from '../routes/routes.js';
import ApplicationError from '../../presentation/errors/application-error.js';
import errorMiddleware from '../middlewares/error-middleware.js';

export default (app) => {
  // Dev logging middleware
  if (envConfig.isDev) {
    app.use(morgan('dev'));
  }

  app.get('/test', (req, res) => res.json({ test: 'It is working!' }));
  app.use('/api/v1', rateLimiter, routes);

  // Error 404 handler
  app.use((req, res, next) => next(new ApplicationError('Route not found', 404)));

  // Error handler
  app.use(errorMiddleware);
};
