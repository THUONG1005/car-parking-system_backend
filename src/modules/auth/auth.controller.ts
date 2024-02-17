import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessTokenGuard, RefreshTokenGuard } from 'src/common/guards';
import { RequestUser } from 'src/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoginUserDto, RegisterUserDto } from './dtos';
import { SuccessResponseDto } from 'src/common/dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Put('/login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    try {
      const { user, refreshToken, accessToken } = await this.authService.loginUser(
        loginUserDto.email,
        loginUserDto.password,
      );

      return new SuccessResponseDto(HttpStatus.OK, 'Đăng nhập thành công.', {
        user: user,
        tokens: {
          refreshToken: refreshToken,
          accessToken: accessToken,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('/register')
  @UseInterceptors(FileInterceptor('avatar'))
  async registerUser(
    @Body() registerUserDto: RegisterUserDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    try {
      if (avatar) {
        if (!new RegExp('(jpg|jpeg|png|gif)$', 'i').test(avatar.mimetype)) {
          throw new HttpException('File không đúng định dạng.', HttpStatus.BAD_REQUEST);
        }

        if (avatar.size > 10 * 1024 * 1024) {
          throw new HttpException('File phải có kích thước nhỏ hơn 10Mb.', HttpStatus.BAD_REQUEST);
        }
      }

      const user = await this.authService.registerUser(registerUserDto, avatar);

      return new SuccessResponseDto(HttpStatus.CREATED, 'Đăng ký thành công.', {
        user,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/get-tokens')
  @UseGuards(RefreshTokenGuard)
  async getAccessToken(@RequestUser('id') requestUserId: number) {
    try {
      const tokens = await this.authService.getTokens(requestUserId);

      return new SuccessResponseDto(HttpStatus.OK, 'Lấy tokens mới thành công.', {
        tokens: tokens,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/logout')
  @UseGuards(AccessTokenGuard)
  async logOutMyUser(@RequestUser('id') requestUserId: number) {
    try {
      await this.authService.logoutUser(requestUserId);

      return new SuccessResponseDto(HttpStatus.OK, 'Đăng xuất thành công.', null);
    } catch (error) {
      throw error;
    }
  }
}

