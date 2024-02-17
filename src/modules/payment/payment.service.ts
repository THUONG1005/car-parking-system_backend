import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { SearchDto } from 'src/common/dtos';
import { getPagination } from 'src/common/utils/helper';
import { Slot } from '../slot/slot.entity';
import { Parking } from '../parking/parking.entity';

@Injectable()
export class PaymentService {
  constructor(@InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>) {}

  async getPaymentByParkingId(parkingId: number) {
    return await this.paymentRepository.findOneBy({ parkingId });
  }

  async getAllPayment(searchDto: SearchDto) {
    const { limit, offset } = getPagination(searchDto);

    const [list, count]: [any[], number] = await this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndMapOne('payment.parking', Parking, 'parking', 'payment.parking_id = parking.id')
      .leftJoinAndMapOne('payment.slot', Slot, 'slot', 'parking.slot_id = slot.id')
      .limit(limit)
      .offset(offset)
      .orderBy('payment.id', 'DESC')
      .getManyAndCount();

    return {
      payments: list,
      currentItems: list.length,
      totalItems: count,
    };
  }

  async countPayment() {
    let totalPayment = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.cost)', 'totalPayment')
      .getRawOne();

    return { totalPayment: totalPayment.totalPayment ? parseInt(totalPayment.totalPayment) : 0 };
  }

  async deletePaymentById(id: number) {
    return await this.paymentRepository.delete(id);
  }
}
