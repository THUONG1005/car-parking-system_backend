import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { Parking } from '../parking/parking.entity';
import { Slot } from '../slot/slot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Parking, Slot])],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
