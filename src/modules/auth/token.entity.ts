import { TokenType } from '../../common/types';
import { Base } from '../../common/entities/';
import { Entity, Column } from 'typeorm';

@Entity('token')
export class Token extends Base {
  @Column({
    name: 'value',
    type: 'varchar',
    nullable: false,
  })
  value: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: TokenType,
    nullable: false,
  })
  type: TokenType;

  @Column({
    name: 'user_id',
    type: 'int',
    nullable: false,
  })
  userId: number;

  @Column({
    name: 'expired_in',
    type: 'bigint',
    nullable: false,
    transformer: {
      to: (value) => value,
      from: (value) => Number(value),
    },
  })
  expiredIn: number;

  @Column({
    name: 'is_expired',
    type: 'boolean',
    default: false,
    nullable: false,
  })
  isExpired: boolean;
}
