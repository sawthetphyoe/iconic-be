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
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApproveOrderDto } from './dto/approve-order.dto';
import mongoose from 'mongoose';
import { Roles, User } from '@/common/decorators';
import { UserRole } from '@/enums';
import { RequestUser } from '@/interfaces';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(UserRole.CUSTOMER)
  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @User() user: RequestUser,
  ) {
    try {
      const newOrder = await this.ordersService.create(
        createOrderDto,
        user.email,
      );
      return {
        id: newOrder._id.toString(),
        message: 'Order created successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.ordersService.findAll();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(UserRole.CUSTOMER)
  @Get('me')
  async findMyOrders(@User() user: RequestUser) {
    try {
      return await this.ordersService.findMyOrders(user.id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId)
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    try {
      return await this.ordersService.findOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Patch('approve/:id')
  async approveOrder(
    @Param('id') id: string,
    @Body() approveOrderDto: ApproveOrderDto,
    @User() user: RequestUser,
  ) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId)
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);

    try {
      const order = await this.ordersService.approve(
        id,
        approveOrderDto,
        user.fullName,
      );
      return {
        id: order._id.toString(),
        message: 'Order approved successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Patch('cancel/:id')
  async cancelOrder(@Param('id') id: string, @User() user: RequestUser) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId)
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    try {
      const order = await this.ordersService.cancel(id, user.fullName);
      return {
        id: order._id.toString(),
        message: 'Order cancelled successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
