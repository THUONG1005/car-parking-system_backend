import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService {
  private readonly logger: winston.Logger;

  constructor(label?: string) {
    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.label({ label: label }),
        winston.format.timestamp({
          format: () => new Date().toLocaleString(),
        }),
        winston.format.printf((info) => {
          return `${info.timestamp} [${info.label}] [${info.level}]: ${info.message}`;
        }),
      ),
      transports: [
        /* File */
        new winston.transports.DailyRotateFile({
          dirname: 'logs',
          filename: '%DATE%.log',
          datePattern: 'YYYY-MM-DD',
        }),
        /* Console */
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize({ all: true })),
        }),
      ],
    });
  }

  info(message: string) {
    this.logger.info(message);
  }

  error(message: string) {
    this.logger.error(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
