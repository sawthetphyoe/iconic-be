import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Staff } from '@/models/staff/schemas/staff.schema';
import { Model } from 'mongoose';
import { ROLES_KEY } from '@/common/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectModel(Staff.name) private staffModel: Model<Staff>,
  ) {}
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are defined, then allow access
    if (!roles) return true;

    // If roles are defined, then get the user object from the request object
    const { user } = context.switchToHttp().getRequest();

    // If user does not exist in the database, then throw an error
    const staff = await this.staffModel.findById(user.id).lean().exec();
    if (!staff)
      throw new HttpException('Authorization failure', HttpStatus.FORBIDDEN);

    // If user has the required role, then allow access
    if (roles.includes(user.role)) return true;

    // If user does not have the required role, then throw an error
    throw new HttpException(
      "You don't have permission to perform this action",
      HttpStatus.FORBIDDEN,
    );
  }
}
