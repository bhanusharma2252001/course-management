import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const winstonLogger = WinstonModule.createLogger({
  transports: [
  
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike()
      )
    }),


    new winston.transports.File({
      filename: 'logs/app.log',
      level: 'info', // write for info + warn + error levels
    }),

    // Separate error log file
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
  ],
});
