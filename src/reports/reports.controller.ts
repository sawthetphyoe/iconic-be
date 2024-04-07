import { Controller, Get } from '@nestjs/common';
import { ReportsService } from '@/reports/reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async getReports() {
    return await this.reportsService.getReports();
  }
}
