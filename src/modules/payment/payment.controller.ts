import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { SearchDto, SuccessResponseDto } from 'src/common/dtos';
import { AccessTokenGuard, UserRoleGuard } from 'src/common/guards';
import { RoleType } from 'src/common/types';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('/get-all')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async getAllPayment(@Query() searchDto: SearchDto) {
    try {
      const { payments, currentItems, totalItems } = await this.paymentService.getAllPayment(
        searchDto,
      );

      return new SuccessResponseDto(HttpStatus.OK, 'Lấy danh sách thành công.', {
        payments,
        currentItems,
        totalItems,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/count')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async countPayment() {
    try {
      const count = await this.paymentService.countPayment();

      return new SuccessResponseDto(HttpStatus.OK, 'Lấy thông tin thành công.', count);
    } catch (error) {
      throw error;
    }
  }

  @Get('/get-by-parking-id/:parkingId')
  async getPaymentByParkingId(@Param('parkingId', ParseIntPipe) parkingId: number) {
    try {
      const payment = await this.paymentService.getPaymentByParkingId(parkingId);
      if (!payment) {
        throw new HttpException('Thông tin không tồn tại.', HttpStatus.NOT_FOUND);
      }

      return new SuccessResponseDto(HttpStatus.OK, 'Lấy thông tin thành công.', {
        payment,
      });
    } catch (error) {
      throw error;
    }
  }

  @Delete('/delete-by-id/:id')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async deletePaymentById(@Param('id', ParseIntPipe) id: number) {
    try {
      const res = await this.paymentService.deletePaymentById(id);
      if (!res.affected) {
        throw new HttpException('Thông tin không tồn tại.', HttpStatus.NOT_FOUND);
      }

      return new SuccessResponseDto(HttpStatus.OK, 'Xóa thành công.', null);
    } catch (error) {
      throw error;
    }
  }
}
