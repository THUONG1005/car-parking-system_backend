import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { User } from '../user/user.entity';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dtos';
import { TokenPayloadDto } from 'src/common/dtos';
import { compareHashedString, hashString } from 'src/common/utils/helper';
import { TokenType } from 'src/common/types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Token) private readonly tokenRepository: Repository<Token>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,

    private readonly cloudinaryService: CloudinaryService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto, avatar: Express.Multer.File) {
    const isValidUser: User = await this.userRepository.findOneBy({
      email: registerUserDto.email,
    });
    if (isValidUser) {
      throw new HttpException('Người dùng đã tồn tại.', HttpStatus.CONFLICT);
    }

    if (avatar) {
      const uploadResult = await this.cloudinaryService.uploadFile(avatar);
      registerUserDto.avatar = uploadResult.url;
    }

    const user: User = await this.userRepository.save(
      this.userRepository.create({
        ...registerUserDto,
        password: await hashString(registerUserDto.password),
      }),
    );

    delete user.password;

    return user;
  }

  async loginUser(email: string, password: string) {
    const user: User = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new HttpException('Email hoặc mật khẩu không chính xác.', HttpStatus.BAD_REQUEST);
    }

    if ((await compareHashedString(password, user.password)) === false) {
      throw new HttpException('Email hoặc mật khẩu không chính xác.', HttpStatus.BAD_REQUEST);
    }

    const [refreshToken, accessToken] = await Promise.all([
      this.generateAndStoreToken(
        TokenType.REFRESH,
        user.id,
        { id: user.id },
        String(process.env.JWT_REFRESH_SECRET),
        Number(process.env.JWT_REFRESH_EXPIRED),
      ),
      this.generateAndStoreToken(
        TokenType.ACCESS,
        user.id,
        { id: user.id },
        String(process.env.JWT_ACCESS_SECRET),
        Number(process.env.JWT_ACCESS_EXPIRED),
      ),
    ]);

    delete user.password;

    return {
      user: user,
      refreshToken: refreshToken,
      accessToken: accessToken,
    };
  }

  async getTokens(userId: number) {
    const user: User = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException('Người dùng không tồn tại.', HttpStatus.NOT_FOUND);
    }

    const [refreshToken, accessToken] = await Promise.all([
      this.generateAndStoreToken(
        TokenType.REFRESH,
        user.id,
        { id: user.id },
        String(process.env.JWT_REFRESH_SECRET),
        Number(process.env.JWT_REFRESH_EXPIRED),
      ),
      this.generateAndStoreToken(
        TokenType.ACCESS,
        user.id,
        { id: user.id },
        String(process.env.JWT_ACCESS_SECRET),
        Number(process.env.JWT_ACCESS_EXPIRED),
      ),
    ]);

    return {
      refreshToken: refreshToken,
      accessToken: accessToken,
    };
  }

  async logoutUser(userId: number): Promise<void> {
    /* Lấy token cũ */
    const [refreshToken, accessToken] = await Promise.all([
      this.tokenRepository
        .createQueryBuilder('token')
        .where('token.user_id = :userId', { userId: userId })
        .andWhere('token.type = :tokenType', { tokenType: TokenType.REFRESH })
        .andWhere('token.isExpired = :isExpired', { isExpired: false })
        .orderBy('token.id', 'DESC')
        .getOne(),
      this.tokenRepository
        .createQueryBuilder('token')
        .where('token.user_id = :userId', { userId: userId })
        .andWhere('token.type = :tokenType', { tokenType: TokenType.ACCESS })
        .andWhere('token.isExpired = :isExpired', { isExpired: false })
        .orderBy('token.id', 'DESC')
        .getOne(),
    ]);
    if (refreshToken === null || accessToken === null) {
      throw new HttpException('Người dùng chưa đăng nhập.', HttpStatus.NOT_FOUND);
    }

    /* Đánh dấu token cũ đã hết hạn */
    await Promise.all([
      this.tokenRepository.save(
        this.tokenRepository.create({
          id: refreshToken.id,
          isExpired: true,
          updatedId: userId,
        }),
      ),
      this.tokenRepository.save(
        this.tokenRepository.create({
          id: accessToken.id,
          isExpired: true,
          updatedId: userId,
        }),
      ),
    ]);
  }

  private async generateAndStoreToken(
    type: TokenType,
    userId: number,
    payload: TokenPayloadDto,
    secret: string,
    expiredIn: number,
  ): Promise<any> {
    const newToken: string = await this.jwtService.signAsync(payload, {
      secret: secret,
      expiresIn: expiredIn,
    });

    await this.tokenRepository.save(
      this.tokenRepository.create({
        userId: userId,
        value: await hashString(newToken),
        type: type,
        expiredIn: expiredIn,
        createdId: userId,
        updatedId: userId,
      }),
    );

    const token = {
      value: newToken,
      type: type,
      expiredIn: expiredIn,
    };

    return token;
  }
}
