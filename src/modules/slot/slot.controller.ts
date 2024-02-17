import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SlotService } from './slot.service';
import { CreateSlotDto, UpdateSlotDto } from './dtos';
import { SearchDto, SuccessResponseDto } from 'src/common/dtos';
import { AccessTokenGuard, UserRoleGuard } from 'src/common/guards';
import { RoleType } from 'src/common/types';

@Controller('slot')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @Post('/create')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async createSlot(@Body() createSlotDto: CreateSlotDto) {
    try {
      const slot = await this.slotService.createSlot(createSlotDto);

      return new SuccessResponseDto(HttpStatus.OK, 'Tạo thành công.', {
        slot,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/get-all')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async getAllSlot(@Query() searchDto: SearchDto) {
    try {
      const { slots, currentItems, totalItems } = await this.slotService.getAllSlot(searchDto);

      return new SuccessResponseDto(HttpStatus.OK, 'Lấy danh sách thành công.', {
        slots,
        currentItems,
        totalItems,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/get-by-id/:id')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async getSlotById(@Param('id', ParseIntPipe) id: number) {
    try {
      const slot = await this.slotService.getSlotById(id);
      if (!slot) {
        throw new HttpException('Thông tin không tồn tại.', HttpStatus.NOT_FOUND);
      }

      return new SuccessResponseDto(HttpStatus.OK, 'Lấy thông tin thành công', {
        slot,
      });
    } catch (error) {
      throw error;
    }
  }

  @Put('/update/:id')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async updateSlotById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSlotDto: UpdateSlotDto,
  ) {
    try {
      const slot = await this.slotService.updateSlotById(id, updateSlotDto);

      return new SuccessResponseDto(HttpStatus.OK, 'Cập nhật thành công.', {
        slot,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/count')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async countSlot() {
    try {
      const count = await this.slotService.countSlot();

      return new SuccessResponseDto(HttpStatus.OK, 'Lấy thông tin thành công.', count);
    } catch (error) {
      throw error;
    }
  }

  @Delete('/delete/:id')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async deleteSlotById(@Param('id', ParseIntPipe) id: number) {
    try {
      const res = await this.slotService.deleteSlotById(id);
      if (!res.affected) {
        throw new HttpException('Thông tin không tồn tại.', HttpStatus.NOT_FOUND);
      }

      return new SuccessResponseDto(HttpStatus.OK, 'Xóa thành công.', null);
    } catch (error) {
      throw error;
    }
  }
}

