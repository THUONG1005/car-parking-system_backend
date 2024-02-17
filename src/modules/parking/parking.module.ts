import { Module } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { ParkingController } from './parking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parking } from './parking.entity';
import { Card } from '../card/card.entity';
import { Slot } from '../slot/slot.entity';
import { Payment } from '../payment/payment.entity';
import { Transaction } from '../transaction/transaction.entity';
import { Price } from '../price/price.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Parking,
      Card,
      Slot,
      Payment,
      Transaction,
      Price,
    ]),
  ],
  controllers: [ParkingController],
  providers: [ParkingService],
  exports: [ParkingService],
})
export class ParkingModule {}
