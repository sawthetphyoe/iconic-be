import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { RequestUser } from '@/interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Staff } from '@/models/staff/schemas/staff.schema';
import { Model } from 'mongoose';
import { UserRole } from '@/enums';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectModel(Staff.name) private staffModel: Model<Staff>,
  ) {}
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();

    // If no roles are defined, then allow access
    if (!roles || roles.length === 0) return true;

    // If roles are defined, then check for authorization
    // If no authorization header is present, then throw an error
    const accessToken = (request as Request).headers.authorization?.split(
      ' ',
    )[1];
    if (!accessToken)
      throw new HttpException('Authorization failure', HttpStatus.UNAUTHORIZED);

    // If authorization header is present, then verify the token
    const user = this.verifyToken(accessToken);

    // TODO : Update this implementation - if role is customer, check in customer models
    if (user.role === UserRole.CUSTOMER)
      throw new HttpException(
        'Customer authentication is not implemented yet',
        HttpStatus.FORBIDDEN,
      );

    // If token is valid, then check if the user exists in the database
    // If user does not exist, then throw an error
    const staff = await this.staffModel.findById(user.id).lean().exec();
    if (!staff)
      throw new HttpException('Authorization failure', HttpStatus.FORBIDDEN);

    // If token is valid and user exists in a database then check if the user has the required role
    // If user has the required role, then allow access
    if (roles.includes(user.role)) return true;

    // If user does not have the required role, then throw an error
    throw new HttpException(
      "You don't have permission to perform this action",
      HttpStatus.FORBIDDEN,
    );
  }

  private verifyToken(token: string) {
    try {
      return jwt.verify(token, 'iconic-jwt-secret') as RequestUser;
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }
  }
}
