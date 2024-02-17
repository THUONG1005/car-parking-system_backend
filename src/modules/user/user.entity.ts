import { GenderType, RoleType } from '../../common/types';
import { Base } from '../../common/entities';
import { Entity, Column } from 'typeorm';

@Entity('user')
export class User extends Base {
  @Column({
    name: 'full_name',
    type: 'varchar',
    nullable: false,
  })
  fullName: string;

  @Column({
    name: 'birthday',
    type: 'date',
    nullable: false,
  })
  birthday: Date;

  @Column({
    name: 'gender',
    type: 'enum',
    enum: GenderType,
    nullable: false,
  })
  gender: GenderType;

  @Column({
    name: 'address',
    type: 'varchar',
    nullable: false,
  })
  address: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    nullable: false,
  })
  phoneNumber: string;

  @Column({
    name: 'avatar',
    type: 'text',
    default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png',
    nullable: false,
  })
  avatar: string;

  @Column({
    name: 'email',
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: RoleType,
    default: RoleType.USER,
    nullable: false,
  })
  role: RoleType;
}
