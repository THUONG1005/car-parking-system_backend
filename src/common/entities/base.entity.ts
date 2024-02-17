import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export abstract class Base {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'int',
    comment: 'id',
  })
  id: number;

  @Column({
    name: 'created_id',
    type: 'int',
    nullable: true,
    comment: 'id người tạo',
  })
  createdId: number;

  @Column({
    name: 'updated_id',
    type: 'int',
    nullable: true,
    comment: 'id người cập nhật',
  })
  updatedId: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    comment: 'Thời gian tại thời điểm tạo',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    comment: 'Thời gian tại thời điểm cập nhật',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    comment: 'Thời gian tại thời điểm xóa',
  })
  deletedAt: Date;
  
}
