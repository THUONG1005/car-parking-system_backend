import {
  Body,
  Controller,
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
import { ParkingService } from './parking.service';
import { CardCodeDto } from './dtos';
import { SearchDto, SuccessResponseDto } from 'src/common/dtos';
import { AccessTokenGuard, UserRoleGuard } from 'src/common/guards';
import { RoleType } from 'src/common/types';
import { toLocalDatetimeString } from 'src/common/utils/helper';

@Controller('parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Post('/create')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async createParking(@Body() cardCodeDto: CardCodeDto) {
    try {
      const { parking, slot, card } = await this.parkingService.createParking(cardCodeDto);

      return new SuccessResponseDto(HttpStatus.CREATED, 'Tạo thành công.', {
        parking,
        slot,
        card,
      });
    } catch (error) {
      throw error;
    }
  }

  @Put('/update')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async updateParking(@Body() cardCodeDto: CardCodeDto) {
    try {
      const { parking, slot, card, cost } = await this.parkingService.updateParking(cardCodeDto);

      return new SuccessResponseDto(HttpStatus.OK, 'Cập nhật thành công.', {
        parking,
        slot,
        card,
        cost,
        stringLocalTimeCheckinAt: toLocalDatetimeString(new Date(parking.createdAt)).slice(11, 19),
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/get-location-by-card-code/:cardCode')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async getLocationByCardCode(@Param() cardCodeDto: CardCodeDto) {
    try {
      const slot = await this.parkingService.getLocationParkingByCardCode(cardCodeDto.cardCode);

      return new SuccessResponseDto(HttpStatus.OK, 'Lấy thông tin thành công.', {
        slot,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/get-by-id/:id')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async getParkingById(@Param('id', ParseIntPipe) id: number) {
    try {
      const parking = await this.parkingService.getParkingById(id);
      if (!parking) {
        throw new HttpException('Thông tin không tồn tại.', HttpStatus.NOT_FOUND);
      }

      return new SuccessResponseDto(HttpStatus.OK, 'Lấy thông tin thành công.', {
        parking,
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
      const count = await this.parkingService.countPaking();

      return new SuccessResponseDto(HttpStatus.OK, 'Lấy thông tin thành công.', count);
    } catch (error) {
      throw error;
    }
  }

  @Get('/get-all')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async getAllParking(@Query() searchDto: SearchDto) {
    try {
      const { parkings, currentItems, totalItems } = await this.parkingService.getAllParking(
        searchDto,
      );

      return new SuccessResponseDto(HttpStatus.OK, 'Lấy danh sách thành công.', {
        parkings,
        currentItems,
        totalItems,
      });
    } catch (error) {
      throw error;
    }
  }
}

