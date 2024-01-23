import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const exceptionResponse: string | NonNullable<unknown> =
      exception.getResponse();

    delete exceptionResponse['statusCode'];
    delete exceptionResponse['error'];

    const responseBody = {
      success: false,
      ...(typeof exceptionResponse === 'string'
        ? { message: exceptionResponse }
        : exceptionResponse),
      issuedAt: new Date(),
    };

    response.status(exception.getStatus()).json(responseBody);
  }
}
