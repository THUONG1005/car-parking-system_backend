import { CardType } from '../../common/types';
import { Base } from '../../common/entities';
import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity('card')
export class Card extends Base {
  @Column({
    name: 'code',
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  code: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: CardType,
    nullable: false,
  })
  type: CardType;

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
    name: 'user_email',
    type: 'varchar',
    nullable: true,
  })
  userEmail: string;

  @BeforeUpdate()
  @BeforeInsert()
  async updateAmount() {
    if (this.type === CardType.GUEST) {
      this.amount = 0;
      this.userEmail = null;
    }
  }
}
