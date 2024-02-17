import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { SearchDto, SuccessResponseDto } from 'src/common/dtos';
import { AccessTokenGuard, UserRoleGuard } from 'src/common/guards';
import { RoleType } from 'src/common/types';
import { Delete, Param } from '@nestjs/common/decorators';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  @Get('/get-all')
  async getAllTransaction(@Query() searchDto: SearchDto) {
    try {
      const { transactions, currentItems, totalItems } =
        await this.transactionService.getAllTransaction(searchDto);

      return new SuccessResponseDto(HttpStatus.OK, 'Lấy danh sách thành công.', {
        transactions,
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
  async countTransaction() {
    try {
      const count = await this.transactionService.countTransaction();

      return new SuccessResponseDto(HttpStatus.OK, 'Lấy thông tin thành công.', count);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  @Get('/get-by-id/:id')
  async getTransactionById(@Param('id', ParseIntPipe) id: number) {
    try {
      const transaction = await this.transactionService.getTransactionById(id);
      if (!transaction) {
        throw new HttpException('Thông tin không tồn tại.', HttpStatus.NOT_FOUND);
      }

      return new SuccessResponseDto(HttpStatus.OK, 'Lấy thông tin thành công.', {
        transaction,
      });
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  @Delete('/delete/:id')
  async deleteTransactionById(@Param('id', ParseIntPipe) id: number) {
    try {
      const res = await this.transactionService.deleteTransactionById(id);
      if (!res.affected) {
        throw new HttpException('Thông tin không tồn tại.', HttpStatus.NOT_FOUND);
      }

      return new SuccessResponseDto(HttpStatus.OK, 'Xoá thành công.', null);
    } catch (error) {
      throw error;
    }
  }
}
