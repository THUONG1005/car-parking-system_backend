import { TransactionType } from '../../common/types';
import { Base } from '../../common/entities';
import { Entity, Column } from 'typeorm';

@Entity('transaction')
export class Transaction extends Base {
  @Column({
    name: 'amount',
    type: 'bigint',
    nullable: false,
    transformer: {
      to: (value) => value,
      from: (value) => Number(value),
    },
  })
  amount: number;

  @Column({
    name: 'type',
    type: 'enum',
    enum: TransactionType,
    nullable: false,
  })
  type: TransactionType;

  @Column({
    name: 'card_code',
    type: 'varchar',
    nullable: false,
  })
  cardCode: string;

}

