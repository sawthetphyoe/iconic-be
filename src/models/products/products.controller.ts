import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import {
  CreateProductDto,
  ResponseProductDto,
  UpdateProductDto,
} from '@/models/products/dto';
import { Public, User } from '@/common/decorators';
import { ProductsService } from './products.service';
import { MutationSuccessResponse, Pageable, RequestUser } from '@/interfaces';
import mongoose from 'mongoose';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { DoSpacesService } from '@/doSpaces/doSpace.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { ProductVariantsService } from '@/models/product-variants/product-variants.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productService: ProductsService,
    private readonly doSpacesService: DoSpacesService,
    private readonly productVariantsService: ProductVariantsService,
  ) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createProductDto: CreateProductDto,
    @User() user: RequestUser,
  ) {
    try {
      const productImages = await Promise.all(
        files.map((file) =>
          this.doSpacesService.uploadFile(
            file,
            `${createProductDto.name.toLowerCase().replaceAll(' ', '_')}_${file.fieldname
              .split('#')[0]
              .replaceAll(' ', '_')}`,
          ),
        ),
      );

      const newProduct = await this.productService.create(
        createProductDto,
        productImages,
        user.fullName,
      );
      return {
        id: newProduct._id.toString(),
        message: 'Product created successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @Get()
  async search(
    @Query() query: ExpressQuery,
  ): Promise<Pageable<ResponseProductDto>> {
    try {
      return await this.productService.search(query);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @Get('all')
  async findAll(@Query() query: ExpressQuery): Promise<ResponseProductDto[]> {
    try {
      return await this.productService.findAll(query);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @Get('new-arrivals')
  async findNewArrivals() {
    try {
      return await this.productVariantsService.findNewArrivals();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid)
      throw new HttpException('Product not found', HttpStatus.BAD_REQUEST);

    try {
      return await this.productService.findOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @Get('details/:id')
  async findDetails(@Param('id') id: string) {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid)
      throw new HttpException('Product not found', HttpStatus.BAD_REQUEST);

    try {
      return await this.productService.findDetails(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor())
  async update(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() updateProductDto: UpdateProductDto,
    @User() user: RequestUser,
  ) {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid)
      throw new HttpException('Product not found', HttpStatus.BAD_REQUEST);

    try {
      let newImages = [];

      if (files?.length > 0) {
        const targetProduct = await this.productService.findOne(id);

        // Delete old images
        await Promise.all(
          targetProduct.images.map((oldImg) => {
            if (
              files
                .map((file) => file.fieldname.split('#')[0])
                .includes(oldImg.color)
            ) {
              this.doSpacesService.deleteFile(oldImg.imageId);
            }
          }),
        );

        // Upload new images
        newImages = await Promise.all(
          files.map((file) =>
            this.doSpacesService.uploadFile(
              file,
              `${targetProduct.name.toLowerCase().replaceAll(' ', '_')}_${file.fieldname
                .split('#')[0]
                .replaceAll(' ', '_')}`,
            ),
          ),
        );
      }

      await this.productService.update(
        id,
        updateProductDto,
        newImages,
        user.fullName,
      );

      return {
        id,
        message: 'Product updated successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<MutationSuccessResponse> {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid)
      throw new HttpException('Product not found', HttpStatus.BAD_REQUEST);

    try {
      const product = await this.productService.findOne(id);

      await Promise.all(
        product.images.map((image) => {
          this.doSpacesService.deleteFile(image.imageId);
        }),
      );

      await this.productService.remove(id);
      return {
        message: 'Product deleted successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id/images/:imageId')
  async removeImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
    @User() user: RequestUser,
  ): Promise<MutationSuccessResponse> {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid)
      throw new HttpException('Product not found', HttpStatus.BAD_REQUEST);

    try {
      await this.doSpacesService.deleteFile(imageId);
      await this.productService.removeImage(id, imageId, user.fullName);
      return {
        id,
        message: 'Image deleted successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
