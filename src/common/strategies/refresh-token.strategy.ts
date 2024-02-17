import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/user.entity';
import { compareHashedString } from '../utils/helper';
import { TokenPayloadDto } from '../dtos';
import { Token } from 'src/modules/auth/token.entity';
import { TokenType } from '../types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: String(process.env.JWT_REFRESH_SECRET),
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate(req: Request, tokenPayloadDto: TokenPayloadDto): Promise<any> {
    try {
      const user: any = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndMapOne(
          'user.token',
          Token,
          'token',
          'token.user_id = :userId and token.type = :tokenType',
          { userId: tokenPayloadDto.id, tokenType: TokenType.REFRESH },
        )
        .where('user.id = :userId', { userId: tokenPayloadDto.id })
        .addOrderBy('token.id', 'DESC')
        .getOne();

      if (user === null || user.token === null || user.token.isExpired === true) {
        throw new UnauthorizedException();
      }

      if (
        (await compareHashedString(
          req.get('authorization')?.replace('Bearer ', '').trim(),
          user.token.value,
        )) === false
      ) {
        throw new HttpException('Token đã bị thay đổi.', HttpStatus.UNAUTHORIZED);
      }

      delete user.password;
      delete user.token;

      return user;
    } catch (error) {
      throw error;
    }
  }
}
