import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenStrategy, RefreshTokenStrategy } from 'src/common/strategies';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token])],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    UserService,
    CloudinaryService,
    RefreshTokenStrategy,
    AccessTokenStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
