import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenPayloadDto } from '../dtos';
import { User } from 'src/modules/user/user.entity';
import { Token } from 'src/modules/auth/token.entity';
import { TokenType } from '../types';
import { Request } from 'express';
import { compareHashedString } from '../utils/helper';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access-token') {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: String(process.env.JWT_ACCESS_SECRET),
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
          { userId: tokenPayloadDto.id, tokenType: TokenType.ACCESS },
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
          user.token?.value,
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
