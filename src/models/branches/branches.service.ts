import { Injectable } from '@nestjs/common';
import { CreateBranchDto, UpdateBranchDto } from '@/models/branches/dto';

@Injectable()
export class BranchesService {
  create(createBranchDto: CreateBranchDto) {
    return 'This action adds a new branch';
  }

  findAll() {
    return `This action returns all branches`;
  }

  findOne(id: string) {
    return `This action returns a #${id} branch`;
  }

  update(id: string, updateBranchDto: UpdateBranchDto) {
    return `This action updates a #${id} branch`;
  }

  remove(id: string) {
    return `This action removes a #${id} branch`;
  }
}
