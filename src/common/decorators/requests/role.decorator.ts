import { UserRole } from '@/enums';
import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '@/common/constants';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
