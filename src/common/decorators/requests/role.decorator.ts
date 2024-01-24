import { StaffRole } from '@/enums';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: StaffRole[]) => SetMetadata('roles', roles);
