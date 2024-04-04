import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from '@/models/customers/schemas/customer.schema';
import { Model } from 'mongoose';
import { ResponseCustomerDto } from '@/models/customers/dto/response-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}
  async findAll() {
    const customers = await this.customerModel
      .find()
      .populate('memberType')
      .lean()
      .exec();

    if (!customers) throw new Error('No customers found');

    return customers.map((item) => new ResponseCustomerDto(item));
  }

  async findOne(id: string) {
    const customer = await this.customerModel
      .findById(id)
      .populate('memberType')
      .lean()
      .exec();

    if (!customer) throw new Error('Customer not found');

    return new ResponseCustomerDto(customer);
  }

  async findByEmail(email: string) {
    const customer = await this.customerModel
      .findOne({ email })
      .populate('memberType')
      .lean()
      .exec();

    if (!customer) throw new Error('Customer not found');

    return new ResponseCustomerDto(customer);
  }

  remove(id: string) {
    return `This action removes a #${id} customer`;
  }
}
