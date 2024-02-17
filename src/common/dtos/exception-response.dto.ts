import {
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class ExceptionResponseDto {
  statusCode: HttpStatus;
  message: string | object;

  constructor(exception: unknown) {
    if (exception instanceof BadRequestException) {
      const tmpMessage = exception.getResponse();

      this.statusCode = HttpStatus.BAD_REQUEST;
      this.message =
        typeof tmpMessage === 'object'
          ? (tmpMessage as any).message
          : JSON.parse(tmpMessage as string).message;
    } else if (exception instanceof NotFoundException) {
      this.statusCode = HttpStatus.NOT_FOUND;
      this.message = 'Đường dẫn không tồn tại.';
    } else if (exception instanceof UnauthorizedException) {
      this.statusCode = HttpStatus.UNAUTHORIZED;
      this.message = 'Bạn không có quyền truy cập.';
    } else if (exception instanceof HttpException) {
      this.statusCode = exception.getStatus();
      this.message = exception.message;
    } else {
      this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      this.message = 'Lỗi máy chủ.';
    }
    
  }
}
