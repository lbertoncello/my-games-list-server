import { bodyParser, contentType, cors, helmet, mongoSanitize, urlEncoded, xss } from '../middlewares/middlewares.js';

export default (app) => {
  app.use(bodyParser);
  app.use(contentType);
  app.use(cors);
  app.use(helmet);
  app.use(mongoSanitize);
  app.use(urlEncoded);
  app.use(xss);
};
