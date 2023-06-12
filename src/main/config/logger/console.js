import envConfig from '../env/env.js';
import { format } from 'winston';

// TODO avoid showing log messages on tests
const errorFormat = format.printf((info) => {
  const sym = Object.getOwnPropertySymbols(info).find((s) => {
    return String(s) === 'Symbol(message)';
  });

  const message = info.message ? info.message : sym ? info[sym] : '';
  const text = info.stack ? `${message}\n${info.stack}` : message;

  return `[${info.timestamp}] [${info.level.toUpperCase()}] ${text}`;
});

// TODO add colors to the text
const consoleTransportOptions = {
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    errorFormat
  ),
  level: envConfig.isDev ? 'debug' : 'info',
  timestamp: true,
  colorize: true,
};

export { consoleTransportOptions };
