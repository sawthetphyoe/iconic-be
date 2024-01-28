import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, HttpException, HttpStatus,
} from '@nestjs/common';
import {
  CreateProductTypeDto,
  UpdateProductTypeDto,
} from '@/models/product-types/dto';
import { User } from '@/common/decorators';
import { ProductTypesService } from './product-types.service';
import { MutationSuccessResponse, RequestUser } from '@/interfaces';

@Controller('product-types')
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) {}

  @Post()
  async create(@Body() createProductTypeDto: CreateProductTypeDto, @User() user: RequestUser): Promise<MutationSuccessResponse> {
    try{
      const newProductType = await this.productTypesService.create(createProductTypeDto, user.fullName);
      return {
        id: newProductType._id.toString(),
        message: 'Product Type created successfully',
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll() {
    return this.productTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productTypesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductTypeDto: UpdateProductTypeDto,
  ) {
    return this.productTypesService.update(id, updateProductTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productTypesService.remove(id);
  }
}
