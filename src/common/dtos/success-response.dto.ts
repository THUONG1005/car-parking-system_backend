import { HttpStatus } from '@nestjs/common';

export class SuccessResponseDto {
  statusCode: HttpStatus;
  message: string | object;
  data: object | null;

  constructor(httpCode: HttpStatus, message: string | object, data: object | null) {
    this.statusCode = httpCode;
    this.message = message;
    this.data = data;
  }
}
