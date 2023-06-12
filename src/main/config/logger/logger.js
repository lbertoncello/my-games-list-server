import { createLogger, transports, format } from 'winston';
import 'winston-mongodb';
import { mongoDbTransportOptions } from './mongodb.js';
import { consoleTransportOptions } from './console.js';

const logger = createLogger({
  level: 'info',
  format: format.combine(format.errors({ stack: true }), format.json()),
  transports: [new transports.MongoDB(mongoDbTransportOptions), new transports.Console(consoleTransportOptions)],
});

export default logger;
