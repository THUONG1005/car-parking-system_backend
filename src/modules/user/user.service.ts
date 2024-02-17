import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserInformationDto, UpdateUserPasswordDto } from './dtos';
import { SearchDto } from 'src/common/dtos';
import { compareHashedString, getPagination, hashString } from 'src/common/utils/helper';
import { User } from './user.entity';
import { RoleType } from 'src/common/types';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async getAllUser(searchDto: SearchDto) {
    const { limit, offset } = getPagination(searchDto);

    const [list, count]: [User[], number] = await this.userRepository
      .createQueryBuilder('user')
      .limit(limit)
      .offset(offset)
      .orderBy('user.id', 'ASC')
      .getManyAndCount();

    list.forEach((value: any) => {
      delete value.password;
    });

    return {
      users: list,
      currentItems: list.length,
      totalItems: count,
    };
  }

  async getUserById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async updateUserInformation(id: number, updateUserInformationDto: UpdateUserInformationDto) {
    const isValidUser: User = await this.userRepository.findOneBy({ id });
    if (!isValidUser) {
      throw new HttpException('Thông tin không tồn tại.', HttpStatus.NOT_FOUND);
    }

    const user: User = await this.userRepository.save(
      this.userRepository.create({
        ...isValidUser,
        ...updateUserInformationDto,
      }),
    );

    delete user.password;

    return user;
  }

  async deleteUserById(id: number) {
    return await this.userRepository.delete(id);
  }

  async updateUserPassword(id: number, updateUserPasswordDto: UpdateUserPasswordDto) {
    const account: User = await this.userRepository.findOneBy({ id });
    if (!account) {
      throw new HttpException('Thông tin không tồn tại.', HttpStatus.NOT_FOUND);
    }

    if (updateUserPasswordDto.newPassword !== updateUserPasswordDto.reNewPassword) {
      throw new HttpException('Hai mật khẩu phải giống nhau.', HttpStatus.BAD_REQUEST);
    }

    const isMatchedPassword: boolean = await compareHashedString(
      updateUserPasswordDto.currentPassword,
      account.password,
    );
    if (!isMatchedPassword) {
      throw new HttpException('Mật khẩu hiện tại không chính xác.', HttpStatus.BAD_REQUEST);
    }

    await this.userRepository.save(
      this.userRepository.create({
        id: id,
        password: await hashString(updateUserPasswordDto.newPassword),
      }),
    );
  }

  async countAccount() {
    const [totalAccount, userAccount, adminAccount] = await Promise.all([
      this.userRepository.createQueryBuilder('user').select('COUNT(*)', 'totalAccount').getRawOne(),
      this.userRepository
        .createQueryBuilder('user')
        .select('COUNT(*)', 'userAccount')
        .where('user.role = :accountRole', { accountRole: RoleType.USER })
        .getRawOne(),
      this.userRepository
        .createQueryBuilder('user')
        .select('COUNT(*)', 'adminAccount')
        .where('user.role = :accountRole', { accountRole: RoleType.ADMIN })
        .getRawOne(),
    ]);

    return {
      totalAccount: totalAccount.totalAccount ? parseInt(totalAccount.totalAccount) : 0,
      userAccount: userAccount.userAccount ? parseInt(userAccount.userAccount) : 0,
      adminAccount: adminAccount.adminAccount ? parseInt(adminAccount.adminAccount) : 0,
    };
  }
}
