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
import { CardService } from './card.service';
import { SearchDto, SuccessResponseDto } from 'src/common/dtos';
import { CreateCardDto, UpdateCardDto } from './dtos';
import { RoleType } from 'src/common/types';
import { AccessTokenGuard, UserRoleGuard } from 'src/common/guards';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post('/create')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async createCard(@Body() createCardDto: CreateCardDto) {
    try {
      const card = await this.cardService.createCard(createCardDto);

      return new SuccessResponseDto(HttpStatus.OK, 'Tạo thành công.', {
        card,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/get-all')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async getAllCard(@Query() searchDto: SearchDto) {
    try {
      const { cards, currentItems, totalItems } = await this.cardService.getAllCard(searchDto);

      return new SuccessResponseDto(HttpStatus.OK, 'Lấy danh sách thành công.', {
        cards,
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
  async getCardById(@Param('id', ParseIntPipe) id: number) {
    try {
      const card = await this.cardService.getCardById(id);
      if (!card) {
        throw new HttpException('Thông tin không tồn tại.', HttpStatus.NOT_FOUND);
      }

      return new SuccessResponseDto(HttpStatus.OK, 'Lấy thông tin thành công.', {
        card,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/count')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async countCard() {
    try {
      const count = await this.cardService.countCard();

      return new SuccessResponseDto(HttpStatus.OK, 'Lấy thông tin thành công.', count);
    } catch (error) {
      throw error;
    }
  }

  @Put('/update/:id')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async updateCardById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    try {
      const card = await this.cardService.updateCardById(id, updateCardDto);

      return new SuccessResponseDto(HttpStatus.OK, 'Cập nhật thông tin thành công.', {
        card,
      });
    } catch (error) {
      throw error;
    }
  }

  @Delete('/delete/:id')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async deleteCardById(@Param('id', ParseIntPipe) id: number) {
    try {
      const res = await this.cardService.deleteCardById(id);
      if (!res.affected) {
        throw new HttpException('Thông tin không tồn tại.', HttpStatus.NOT_FOUND);
      }

      return new SuccessResponseDto(HttpStatus.OK, 'Xóa thành công.', null);
    } catch (error) {
      throw error;
    }
  }
}

