import { Injectable } from '@nestjs/common';
import { CustomersService } from '@/models/customers/customers.service';
import { OrdersService } from '@/models/orders/orders.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly customersService: CustomersService,
    private readonly ordersService: OrdersService,
  ) {}
  async getReports() {
    const response: Partial<{
      todayOrders: number;
      totalOrders: number;
      totalCustomers: number;
      monthlyOrders: { date: Date; count: number }[];
    }> = {};

    const totalOrders = await this.ordersService.findAll({});
    const totalCustomers = await this.customersService.findAll({});

    response.todayOrders = await this.ordersService.getTodayOrderCount();
    response.totalOrders = totalOrders.length;
    response.totalCustomers = totalCustomers.length;
    response.monthlyOrders = await this.ordersService.getMonthlyOrderCount();

    return response;
  }
}
