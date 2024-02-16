import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { User } from '@/common/decorators';
import { RequestUser } from '@/interfaces';
import { CreateInventoryDto, UpdateInventoryDto } from '@/models/inventory/dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {
  }

  // create new inventory
  @Post()
  async create(@Body() createInventoryDto: CreateInventoryDto, @User() user: RequestUser) {
    try {
      let newInventory = await this.inventoryService.create(createInventoryDto, user.fullName);
      if (newInventory) {
        return {
          id: newInventory._id.toString(),
          message: 'Inventory created successfully',
        };
      }
    }
    catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInventoryDto: UpdateInventoryDto) {
    return this.inventoryService.update(+id, updateInventoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(+id);
  }
}
