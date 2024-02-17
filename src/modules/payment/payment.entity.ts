import { Base } from '../../common/entities';
import { Entity, Column } from 'typeorm';

@Entity('payment')
export class Payment extends Base {
  @Column({
    name: 'parking_id',
    type: 'int',
    nullable: false,
  })
  parkingId: number;

  @Column({
    name: 'card_code',
    type: 'varchar',
    nullable: false,
  })
  cardCode: string;

  @Column({
    name: 'cost',
    type: 'bigint',
    nullable: false,
    transformer: {
      to: (value) => value,
      from: (value) => Number(value),
    },
  })
  cost: number;
}

