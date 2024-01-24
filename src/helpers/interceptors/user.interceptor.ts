import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import type { Request } from 'express';
import * as jwt from 'jsonwebtoken';

export class UserInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const accessToken = (request as Request).headers?.authorization?.split(
      ' ',
    )[1];
    request.user = jwt.decode(accessToken);
    return next.handle();
  }
}
