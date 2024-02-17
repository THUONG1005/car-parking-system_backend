import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ExceptionResponseDto } from '../dtos';
import { LoggerService } from '../../shared/logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new LoggerService('Exception');

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const errorResponse = new ExceptionResponseDto(exception);

    this.logger.error((exception as any).stack ? (exception as any).stack : errorResponse.message);

    response.status(errorResponse.statusCode).json(errorResponse);
  }
}

