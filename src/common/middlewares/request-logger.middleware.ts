import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../../shared/logger/logger.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new LoggerService('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const startAt = process.hrtime();

    response.on('finish', () => {
      const diff = process.hrtime(startAt);
      const responseTime = Math.ceil((diff[0] * 1000000000 + diff[1]) / 1000000);
      const requestLog: string = `${request.method} ${request.url} - ${
        response.statusCode
      } ${responseTime} ${response.get('content-length')} - ${request.get('user-agent') || ''} ${
        request.ip
      } ${
        request.user
          ? JSON.stringify({
              id: (request.user as any).id,
              fullName: (request.user as any).fullName,
            })
          : 'Unknown'
      }`;

      this.logger.info(requestLog);
    });

    next();
  }
  
}
