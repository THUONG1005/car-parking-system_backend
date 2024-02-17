import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserInformationDto, UpdateUserPasswordDto } from './dtos';
import { RequestUser } from 'src/common/decorators';
import { RoleType } from '../../common/types';
import { SearchDto, SuccessResponseDto } from 'src/common/dtos';
import { UserService } from './user.service';
import { AccessTokenGuard, UserRoleGuard } from 'src/common/guards';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/get-all')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async getAllUser(@Query() searchDto: SearchDto) {
    try {
      const { users, currentItems, totalItems } = await this.userService.getAllUser(searchDto);

      return new SuccessResponseDto(HttpStatus.OK, 'Lấy danh sách thành công.', {
        users,
        currentItems,
        totalItems,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/get-by-id')
  @UseGuards(AccessTokenGuard)
  async getMyUser(@RequestUser('id') requestUserId: number) {
    try {
      const user = await this.userService.getUserById(requestUserId);
      if (!user) {
        throw new HttpException('User không tồn tại.', HttpStatus.NOT_FOUND);
      }

      delete user.password;

      return new SuccessResponseDto(HttpStatus.OK, 'Lấy thông tin thành công.', {
        user,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/count')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async countAccount() {
    try {
      const count = await this.userService.countAccount();

      return new SuccessResponseDto(HttpStatus.OK, 'Lấy thông tin thành công.', count);
    } catch (error) {
      throw error;
    }
  }

  @Get('/get-by-id/:id')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.userService.getUserById(id);
      if (!user) {
        throw new HttpException('User không tồn tại.', HttpStatus.NOT_FOUND);
      }

      delete user.password;

      return new SuccessResponseDto(HttpStatus.OK, 'Lấy thông tin thành công.', {
        user,
      });
    } catch (error) {
      throw error;
    }
  }
  


  @Delete('/delete/:id')
  @UseGuards(UserRoleGuard(RoleType.ADMIN))
  @UseGuards(AccessTokenGuard)
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    try {
      const res = await this.userService.deleteUserById(id);
      if (!res.affected) {
        throw new HttpException('Thông tin không tồn tại.', HttpStatus.NOT_FOUND);
      }

      return new SuccessResponseDto(HttpStatus.OK, 'Xóa thành công.', null);
    } catch (error) {
      throw error;
    }
  }

  @Put('/update-pass')
  @UseGuards(AccessTokenGuard)
  async updateUserPassword(
    @RequestUser('id') requestUserId: number,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    try {
      await this.userService.updateUserPassword(requestUserId, updateUserPasswordDto);

      return new SuccessResponseDto(HttpStatus.OK, 'Cập nhật mật khẩu thành công.', null);
    } catch (error) {
      throw error;
    }
  }

  @Put('/update-info')
  @UseGuards(AccessTokenGuard)
  async updateMyUserInformation(
    @RequestUser('id') requestUserId: number,
    @Body() updateUserInformationDto: UpdateUserInformationDto,
  ) {
    try {
      const user = await this.userService.updateUserInformation(
        requestUserId,
        updateUserInformationDto,
      );

      return new SuccessResponseDto(HttpStatus.OK, 'Cập nhật thông tin thành công.', {
        user,
      });
    } catch (error) {
      throw error;
    }
  }
}
