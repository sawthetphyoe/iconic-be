import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@/common/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();

    // If no authorization header is present, then throw an error
    const accessToken = this.extractTokenFromHeader(request);
    if (!accessToken)
      throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);

    // If authorization header is present, then verify the token and attach the user to the request object
    try {
      request['user'] = await this.jwtService.verifyAsync(accessToken, {
        secret: process.env.JWT_SECRET,
      });
    } catch {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
