import { Injectable } from '@nestjs/common';
import { CreatePaymentTypeDto } from './dto/create-payment-type.dto';
import { UpdatePaymentTypeDto } from './dto/update-payment-type.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentType } from '@/models/payment-types/schemas/payment-type.schema';
import { ResponsePaymentTypeDto } from '@/models/payment-types/dto/response-payment-type.dto';

@Injectable()
export class PaymentTypesService {
  constructor(
    @InjectModel(PaymentType.name)
    private paymentTypeModal: Model<PaymentType>,
  ) {}

  create(createPaymentTypeDto: CreatePaymentTypeDto, createdBy: string) {
    const newPaymentType = new this.paymentTypeModal(
      createPaymentTypeDto,
      createdBy,
    );

    if (!newPaymentType) throw new Error('Payment Type create failed');

    return newPaymentType.save();
  }

  async findAll() {
    const paymentTypes = await this.paymentTypeModal.find().lean().exec();

    if (!paymentTypes) throw new Error('Payment Types not found');

    return paymentTypes.map((item) => new ResponsePaymentTypeDto(item));
  }

  async update(
    id: string,
    updatePaymentTypeDto: UpdatePaymentTypeDto,
    updatedBy: string,
  ) {
    const updatedPaymentType = await this.paymentTypeModal
      .findByIdAndUpdate(
        id,
        { ...updatePaymentTypeDto, updatedBy, updatedAt: new Date() },
        { new: true },
      )
      .lean()
      .exec();

    if (!updatedPaymentType) throw new Error('Payment Type update failed');

    return new ResponsePaymentTypeDto(updatedPaymentType);
  }
}
