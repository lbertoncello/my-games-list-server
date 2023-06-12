import _ from 'lodash';
import __dirname from '../../../utils/dirname.js';
import dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/.env' });

const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 3000;

const baseConfig = {
  env,
  isDev: env === 'development' || env === 'dev',
  port,
};

let envConfig = null;

switch (env) {
  case 'dev':
  case 'development':
    envConfig = (await import('./dev-env.js')).config;

    break;

  case 'prod':
  case 'production':
    envConfig = (await import('./prod-env.js')).config;

    break;

  default:
    envConfig = (await import('./dev-env.js')).config;
}

export default _.merge(baseConfig, envConfig);
