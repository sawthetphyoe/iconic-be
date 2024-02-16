import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProductVariantsService } from './product-variants.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { RequestUser } from '@/interfaces';
import { User } from '@/common/decorators';

@Controller('product-variants')
export class ProductVariantsController {
  constructor(
    private readonly productVariantsService: ProductVariantsService,
  ) {}

  @Post()
  create(
    @Body() createProductVariantDto: CreateProductVariantDto,
    @User() user: RequestUser,
  ) {
    return this.productVariantsService.create(
      createProductVariantDto,
      user.fullName,
    );
  }

  @Get()
  findAll() {
    return this.productVariantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productVariantsService.findOne(id);
  }
}
