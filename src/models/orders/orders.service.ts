import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApproveOrderDto } from './dto/approve-order.dto';
import { Order } from '@/models/orders/schemas/order.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { OrderDetails } from '@/models/orders/schemas/order-details.schema';
import { ResponseOrderDto } from '@/models/orders/dto/response-order.dto';
import { ResponseOrderDetailsDto } from '@/models/orders/dto/response-order-details.dto';
import { ProductVariantsService } from '@/models/product-variants/product-variants.service';
import { OrderStatus } from '@/enums';
import { InventoriesService } from '@/models/inventories/inventories.service';
import { CustomersService } from '@/models/customers/customers.service';
import { ResponseProductVariantDto } from '@/models/product-variants/dto/response-product-variant.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(OrderDetails.name)
    private orderDetailsModel: Model<OrderDetails>,
    private productVariantService: ProductVariantsService,
    private inventoriesService: InventoriesService,
    private customerService: CustomersService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userMail: string) {
    const customer = await this.customerService.findByEmail(userMail);

    if (!customer) throw new Error('Customer not found');

    for (const orderItem of createOrderDto.orderItems) {
      const productVariant = await this.productVariantService.findOne(
        orderItem.productVariantId,
      );

      if (!productVariant) throw new Error(`Product Variant not found`);

      orderItem.price = productVariant.price;
    }

    const newOrder = new this.orderModel({
      customer: customer._id.toString(),
      paymentType: createOrderDto.paymentType,
      totalAmount: createOrderDto.orderItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      ),
    });

    if (!newOrder) throw new Error('Order create failed');

    await newOrder.save();

    const newOrderObj = newOrder.toObject();

    for (const orderItem of createOrderDto.orderItems) {
      const newOrderDetails = new this.orderDetailsModel({
        order: newOrderObj._id.toString(),
        productVariant: orderItem.productVariantId,
        quantity: orderItem.quantity,
        price: orderItem.price,
      });

      if (!newOrderDetails) throw new Error('Order details create failed');

      await newOrderDetails.save();
    }

    return newOrder;
  }

  async findAll(query: ExpressQuery) {
    const filter = {
      ...(query.customer && { customer: query.customer }),
      ...(query.paymentType && { paymentType: query.paymentType }),
    };
    const orders = await this.orderModel
      .find({ ...filter })
      .populate('customer paymentType')
      .lean()
      .exec();

    const orderList = [];

    for (const order of orders) {
      const orderDetails = await this.orderDetailsModel
        .find({ order: order._id.toString() })
        .populate({
          path: 'productVariant',
          populate: {
            path: 'product',
          },
        })
        .select('-order')
        .lean()
        .exec();

      orderList.push({
        ...order,
        paymentType: order.paymentType.name,
        orderItems: orderDetails.map((item) => ({
          ...item,
          subTotal: item.price * item.quantity,
        })),
      });
    }

    if (!orderList) throw new Error('Orders Items not found');

    return orderList.map(
      (item) =>
        new ResponseOrderDto({
          ...item,
          customer: item.customer.name,
          // paymentType: item.paymentType.name,
          orderItems: item.orderItems.map(
            (orderItem: OrderDetails) => new ResponseOrderDetailsDto(orderItem),
          ),
        }),
    );
  }

  async findMyOrders(customerId: string) {
    const orders = await this.orderModel
      .find({ customer: customerId })
      .populate('paymentType')
      .lean()
      .exec();

    const orderList = [];

    for (const order of orders) {
      const orderDetails = await this.orderDetailsModel
        .find({ order: order._id.toString() })
        .populate({
          path: 'productVariant',
          populate: {
            path: 'product',
          },
        })
        .select('-order')
        .lean()
        .exec();

      orderList.push({
        ...order,
        orderItems: orderDetails.map((item) => ({
          ...item,
          subTotal: item.price * item.quantity,
        })),
      });
    }

    if (!orderList) throw new Error('Orders Items not found');

    return orderList.map(
      (item) =>
        new ResponseOrderDto({
          ...item,
          customer: item.customer.name,
          paymentType: item.paymentType.name,
          orderItems: item.orderItems.map(
            (orderItem: OrderDetails) => new ResponseOrderDetailsDto(orderItem),
          ),
        }),
    );
  }

  async findOne(id: string) {
    const order = await this.orderModel
      .findById(id)
      .populate('customer paymentType')
      .lean()
      .exec();

    if (!order) throw new Error('Order not found');

    const orderDetails = await this.orderDetailsModel
      .find({ order: order._id.toString() })
      .populate({
        path: 'productVariant',
        populate: {
          path: 'product',
        },
      })
      .select('-order')
      .lean()
      .exec();

    if (!orderDetails) throw new Error('Order Items not found');

    const orderItems = [];

    for (const orderItem of orderDetails) {
      const productVariant = new ResponseProductVariantDto(
        orderItem.productVariant,
      );
      const inventory = await this.inventoriesService.search({
        productVariant: productVariant._id.toString(),
      });

      if (!inventory)
        throw new Error(
          `Inventory not found for order item - ID : ${orderItem._id.toString()}`,
        );

      const availableBranches = inventory.dtoList.map((item) => {
        return {
          productVariant: item.productVariant._id.toString(),
          branchName: item.branch.name,
          branchId: item.branch._id.toString(),
          inStock: item.quantity,
        };
      });

      orderItems.push({
        ...orderItem,
        availableBranches,
        subTotal: orderItem.price * orderItem.quantity,
      });

      console.log(availableBranches);
    }

    const orderSummary = {
      ...order,
      orderItems: orderItems.map((item) => ({
        ...item,
        subTotal: item.price * item.quantity,
      })),
    };

    return new ResponseOrderDto({
      ...orderSummary,
      customer: orderSummary.customer.name,
      paymentType: orderSummary.paymentType.name,
      orderItems: orderSummary.orderItems.map(
        (orderItem: OrderDetails) => new ResponseOrderDetailsDto(orderItem),
      ),
    });
  }

  async approve(
    id: string,
    updateOrderDto: ApproveOrderDto,
    updatedBy: string,
  ) {
    const existingOrder = await this.orderModel.findById(id).lean().exec();

    if (existingOrder.status === OrderStatus.APPROVED)
      throw new Error('Order already approved');

    const order = await this.orderModel
      .findByIdAndUpdate(
        id,
        { status: OrderStatus.APPROVED, updatedBy },
        { new: true },
      )
      .populate('customer paymentType')
      .lean()
      .exec();

    if (!order) throw new Error('Order not found');

    for (const approvedOrderItem of updateOrderDto.orderItems) {
      const inventory =
        await this.inventoriesService.findInventoryByBranchAndVariant(
          approvedOrderItem.branch,
          approvedOrderItem.productVariantId,
        );

      if (!inventory) throw new Error('Inventory not found');

      if (inventory.quantity < approvedOrderItem.quantity) {
        throw new Error('Not enough stock');
      }

      if (inventory.quantity === approvedOrderItem.quantity) {
        await this.inventoriesService.deleteInventory(inventory._id.toString());
      }

      await this.inventoriesService.updateInventory(
        inventory._id.toString(),
        { quantity: inventory.quantity - approvedOrderItem.quantity },
        order.customer.toString(),
      );
    }

    return order;
  }

  async cancel(id: string, updatedBy) {
    const order = await this.orderModel
      .findByIdAndUpdate(
        id,
        { status: OrderStatus.CANCELLED, updatedBy },
        { new: true },
      )
      .populate('customer paymentType')
      .lean()
      .exec();

    if (!order) throw new Error('Order not found');

    return order;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
