import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from 'src/common/strategies';
import { Token } from '../auth/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token])],
  controllers: [UserController],
  providers: [UserService, RefreshTokenStrategy, AccessTokenStrategy],
  exports: [UserService],
})
export class UserModule {}
