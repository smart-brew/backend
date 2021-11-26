import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

/* LOGGING LEVELS
{ 
  error: 0, 
  warn: 1, 
  info: 2, 
  http: 3,
  verbose: 4, 
  debug: 5, 
  silly: 6 
} */

const logger = createLogger({
  exitOnError: false,
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.DailyRotateFile({
      datePattern: 'DD-MM-YYYY',
      filename: './logs/combined.log',
      level: 'info',
    }),
  ],
  exceptionHandlers: [
    new transports.DailyRotateFile({
      datePattern: 'DD-MM-YYYY',
      filename: './logs/exceptions.log',
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
      level: process.env.LOG_LEVEL,
    })
  );
}

export default logger;
