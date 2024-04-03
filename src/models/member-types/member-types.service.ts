import { Injectable } from '@nestjs/common';
import { CreateMemberTypeDto } from './dto/create-member-type.dto';
import { UpdateMemberTypeDto } from './dto/update-member-type.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MemberType } from '@/models/member-types/schemas/member-type.schema';
import { ResponseMemberTypeDto } from '@/models/member-types/dto/response-member-type.dto';

@Injectable()
export class MemberTypesService {
  constructor(
    @InjectModel(MemberType.name) private memberTypeModal: Model<MemberType>,
  ) {}
  async create(createMemberTypeDto: CreateMemberTypeDto, createdBy: string) {
    const newMemberType = new this.memberTypeModal({
      ...createMemberTypeDto,
      createdBy,
    });

    if (!newMemberType) throw new Error('Member type create failed');

    return newMemberType.save();
  }

  async findByName(name: string) {
    const memberType = await this.memberTypeModal
      .findOne({
        name,
      })
      .lean()
      .exec();

    if (!memberType) throw new Error('Member type not found');

    return new ResponseMemberTypeDto(memberType);
  }

  async findAll() {
    const memberTypes = await this.memberTypeModal.find().lean().exec();

    if (!memberTypes) throw new Error('Member types not found');

    return memberTypes.map((item) => new ResponseMemberTypeDto(item));
  }

  async update(
    id: string,
    updateMemberTypeDto: UpdateMemberTypeDto,
    updatedBy: string,
  ) {
    const memberType = await this.memberTypeModal
      .findByIdAndUpdate(
        id,
        {
          ...updateMemberTypeDto,
          updatedBy,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .lean()
      .exec();

    if (!memberType) throw new Error('Member type not found');

    return new ResponseMemberTypeDto(memberType);
  }
}
