import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberTypeDto } from './create-member-type.dto';

export class UpdateMemberTypeDto extends PartialType(CreateMemberTypeDto) {}
