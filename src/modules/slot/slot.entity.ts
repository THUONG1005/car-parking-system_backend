import { Base } from '../../common/entities';
import { Entity, Column } from 'typeorm';

@Entity('slot')
export class Slot extends Base {
  @Column({
    name: 'station',
    type: 'varchar',
    nullable: false,
  })
  station: string;

  @Column({
    name: 'position',
    type: 'int',
    nullable: false,
  })
  position: number;

  @Column({
    name: 'is_full',
    type: 'boolean',
    nullable: false,
  })
  isFull: boolean;

  @Column({
    name: 'description',
    type: 'varchar',
    nullable: true,
  })
  description: string;
}
