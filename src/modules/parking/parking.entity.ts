import { Base } from '../../common/entities';
import { Entity, Column } from 'typeorm';

@Entity('parking')
export class Parking extends Base {
  @Column({
    name: 'slot_id',
    type: 'int',
    nullable: false,
  })
  slotId: number;

  @Column({
    name: 'card_code',
    type: 'varchar',
    nullable: false,
  })
  cardCode: string;

  @Column({
    name: 'is_checkout',
    type: 'boolean',
    nullable: false,
  })
  isCheckout: boolean;
}
