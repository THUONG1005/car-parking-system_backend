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
import { PriceService } from './price.service';
import { SearchDto, SuccessResponseDto } from 'src/common/dtos';
import { CreatePriceDto, UpdatePriceDto } from './dtos';
import { AccessTokenGuard, UserRoleGuard } from 'src/common/guards';
import { RoleType } from 'src/common/types';

@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Post('/create')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async createPrice(@Body() createPriceDto: CreatePriceDto) {
    try {
      const price = await this.priceService.createPrice(createPriceDto);

      return new SuccessResponseDto(HttpStatus.OK, 'Tạo thành công.', {
        price,
      });
    } catch (error) {
      throw error;
    }
  }

  @Put('/update/:id')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async updatePrice(@Param('id', ParseIntPipe) id: number, @Body() updatePriceDto: UpdatePriceDto) {
    try {
      const price = await this.priceService.updatePrice(id, updatePriceDto.value);

      return new SuccessResponseDto(HttpStatus.OK, 'Cập nhật thành công.', {
        price,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/get-by-id/:id')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async getPriceById(@Param('id', ParseIntPipe) id: number) {
    try {
      const price = await this.priceService.getPriceById(id);
      if (!price) {
        throw new HttpException('Thông tin không tồn tại.', HttpStatus.NOT_FOUND);
      }

      return new SuccessResponseDto(HttpStatus.OK, 'Lấy thông tin thành công.', {
        price,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/get-all')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async getAllPrice(@Query() searchDto: SearchDto) {
    try {
      const { prices, currentItems, totalItems } = await this.priceService.getAllPrice(searchDto);

      return new SuccessResponseDto(HttpStatus.OK, 'Lấy danh sách thành công.', {
        prices,
        currentItems,
        totalItems,
      });
    } catch (error) {
      throw error;
    }
  }
}

