import { UserRole } from '@/enums';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
