import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    try {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const status = exception.getStatus(); // 예외코드
      const message = exception.message;
      response.status(status).json({ message });
      console.log(exception);
    } catch (err) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();

      const message = exception.message;
      response.status(500).json({ message });
      console.log(exception);
    }
  }
}
