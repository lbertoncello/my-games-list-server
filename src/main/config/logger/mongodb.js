import { format } from 'winston';
import envConfig from '../env/env.js';

const errorFormat = format.printf((info) => {
  const sym = Object.getOwnPropertySymbols(info).find((s) => {
    return String(s) === 'Symbol(message)';
  });

  return JSON.stringify({
    timestamp: info.timestamp,
    level: info.level,
    message: info.message ? info.message : sym ? info[sym] : '',
    stack: info.stack,
  });
});

const mongoDbTransportOptions = {
  db: envConfig.dbUrl,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  collection: 'logs',
  level: 'warn',
  format: format.combine(errorFormat, format.metadata()),
  storeHost: true,
  capped: true,
};

export { mongoDbTransportOptions };
