import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PaymentTypesService } from './payment-types.service';
import { CreatePaymentTypeDto } from './dto/create-payment-type.dto';
import { UpdatePaymentTypeDto } from './dto/update-payment-type.dto';
import { User } from '@/common/decorators';
import { RequestUser } from '@/interfaces';
import mongoose from 'mongoose';

@Controller('payment-types')
export class PaymentTypesController {
  constructor(private readonly paymentTypesService: PaymentTypesService) {}

  @Post()
  async create(
    @Body() createPaymentTypeDto: CreatePaymentTypeDto,
    @User() user: RequestUser,
  ) {
    try {
      const paymentType = await this.paymentTypesService.create(
        createPaymentTypeDto,
        user.fullName,
      );

      return {
        id: paymentType._id.toString(),
        message: 'Payment Type created successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll() {
    return this.paymentTypesService.findAll();
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaymentTypeDto: UpdatePaymentTypeDto,
    @User() user: RequestUser,
  ) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId)
      throw new HttpException('Payment Type not found', HttpStatus.NOT_FOUND);
    try {
      const updatedPaymentType = await this.paymentTypesService.update(
        id,
        updatePaymentTypeDto,
        user.fullName,
      );

      return {
        id: updatedPaymentType._id.toString(),
        message: 'Payment Type updated successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
