import { CardType } from '../../common/types';
import { Base } from '../../common/entities';
import { Entity, Column } from 'typeorm';

@Entity('price')
export class Price extends Base {
  @Column({
    name: 'value',
    type: 'bigint',
    nullable: false,
    transformer: {
      to: (value) => value,
      from: (value) => Number(value),
    },
  })
  value: number;

  @Column({
    name: 'type',
    type: 'enum',
    enum: CardType,
    nullable: false,
  })
  type: CardType;
}
