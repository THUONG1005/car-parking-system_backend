import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchDto } from 'src/common/dtos';
import { caculateExpense, getPagination } from 'src/common/utils/helper';
import { Parking } from './parking.entity';
import { Repository, DataSource } from 'typeorm';
import { Payment } from '../payment/payment.entity';
import { Transaction } from '../transaction/transaction.entity';
import { Card } from '../card/card.entity';
import { Slot } from '../slot/slot.entity';
import { Price } from '../price/price.entity';
import { CardCodeDto } from './dtos';
import { TransactionType } from 'src/common/types';

@Injectable()
export class ParkingService {
  constructor(
    @InjectRepository(Parking) private readonly parkingRepository: Repository<Parking>,
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    @InjectRepository(Slot) private readonly slotRepository: Repository<Slot>,
    @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Price) private readonly priceRepository: Repository<Price>,

    private readonly dataSource: DataSource,
  ) {}

  async createParking(cardCodeDto: CardCodeDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      /* Check có thẻ này hay không */
      const card: Card = await this.cardRepository.findOneBy({
        code: cardCodeDto.cardCode,
      });
      if (!card) {
        throw new HttpException('Card không tồn tại.', HttpStatus.FORBIDDEN);
      }

      /* Check đã đỗ xe hay chưa */
      const isParked: Parking = await this.parkingRepository.findOneBy({
        cardCode: cardCodeDto.cardCode,
        isCheckout: false,
      });
      if (isParked) {
        throw new HttpException('Card đang được sử dụng.', HttpStatus.CONFLICT);
      }

      /* Check còn vị trí trống không */
      let slot: Slot = await this.slotRepository.findOneBy({ isFull: false });
      if (!slot) {
        throw new HttpException('Không tìm thấy vị trí.', HttpStatus.NOT_FOUND);
      }

      /* Thêm vào vị trí (check in) */
      const parking: Parking = await queryRunner.manager.getRepository(Parking).save(
        this.parkingRepository.create({
          slotId: slot.id,
          ...cardCodeDto,
          isCheckout: false,
        }),
      );

      /* Cập nhật vị trí (full) */
      slot = await queryRunner.manager.getRepository(Slot).save(
        this.slotRepository.create({
          ...slot,
          isFull: true,
        }),
      );

      await queryRunner.commitTransaction();

      return { parking, slot, card };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllParking(searchDto: SearchDto) {
    const { limit, offset } = getPagination(searchDto);

    const [list, count]: [any[], number] = await this.parkingRepository
      .createQueryBuilder('parking')
      .leftJoinAndMapOne('parking.slot', Slot, 'slot', 'parking.slot_id = slot.id')
      .limit(limit)
      .offset(offset)
      .orderBy('parking.id', 'DESC')
      .getManyAndCount();

    return {
      parkings: list,
      currentItems: list.length,
      totalItems: count,
    };
  }

  async getLocationParkingByCardCode(cardCode: string) {
    const parking: Parking = await this.parkingRepository
      .createQueryBuilder('parking')
      .where('parking.card_code = :cardCode', { cardCode })
      .andWhere('parking.is_checkout = false')
      .getOne();
    if (!parking) {
      throw new HttpException('Card chưa được sử dụng.', HttpStatus.NOT_FOUND);
    }

    return await this.slotRepository.findOneBy({ id: parking.slotId });
  }

  async countPaking() {
    const [totalParking, checkinPaking, checkoutPaking] = await Promise.all([
      this.parkingRepository
        .createQueryBuilder('parking')
        .select('COUNT(*)', 'totalParking')
        .getRawOne(),
      this.parkingRepository
        .createQueryBuilder('parking')
        .select('COUNT(*)', 'checkinPaking')
        .where('parking.is_checkout = false')
        .getRawOne(),
      this.parkingRepository
        .createQueryBuilder('parking')
        .select('COUNT(*)', 'checkoutPaking')
        .where('parking.is_checkout = true')
        .getRawOne(),
    ]);

    return {
      totalParking: totalParking.totalParking ? parseInt(totalParking.totalParking) : 0,
      checkinPaking: checkinPaking.checkinPaking ? parseInt(checkinPaking.checkinPaking) : 0,
      checkoutPaking: checkoutPaking.checkoutPaking ? parseInt(checkoutPaking.checkoutPaking) : 0,
    };
  }

  async getParkingById(id: number) {
    return await this.parkingRepository.findOneBy({ id });
  }

  async updateParking(cardCodeDto: CardCodeDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      /* Check xem có thẻ này hay không */
      let card: Card = await this.cardRepository.findOneBy({
        code: cardCodeDto.cardCode,
      });
      if (!card) {
        throw new HttpException('Card không tồn tại.', HttpStatus.FORBIDDEN);
      }

      /* Check xem đã đỗ xe hay chưa */
      const isParked: Parking = await this.parkingRepository.findOneBy({
        cardCode: cardCodeDto.cardCode,
        isCheckout: false,
      });
      if (!isParked) {
        throw new HttpException('Card chưa được sử dụng.', HttpStatus.CONFLICT);
      }

      /* Check vị trí có xe không */
      let slot: Slot = await this.slotRepository.findOneBy({
        id: isParked.slotId,
        isFull: true,
      });
      if (!slot) {
        throw new HttpException('Không tìm thấy vị trí.', HttpStatus.NOT_FOUND);
      }

      /* Lấy khỏi vị trí (check out) */
      const parking: Parking = await queryRunner.manager.getRepository(Parking).save(
        this.parkingRepository.create({
          ...isParked,
          isCheckout: true,
        }),
      );

      /* Cập nhật vị trí (empty) */
      slot = await queryRunner.manager.getRepository(Slot).save(
        this.slotRepository.create({
          ...slot,
          isFull: false,
        }),
      );

      /* Lấy giá */
      const price: Price = await this.priceRepository.findOneBy({ type: card.type });

      /* Tính toán chi phí */
      const cost: number = caculateExpense(isParked.createdAt, parking.updatedAt, price.value);

      /* Lưu hóa đơn */
      await queryRunner.manager.getRepository(Payment).save(
        this.paymentRepository.create({
          parkingId: parking.id,
          cost: cost,
          cardCode: card.code,
        }),
      );

      /* Check còn đủ tiền hay không */
      if (card.amount >= cost) {
        /* Trừ tiền trong thẻ */
        card = await queryRunner.manager.getRepository(Card).save(
          this.cardRepository.create({
            ...card,
            amount: card.amount - cost,
          }),
        );

        /* Lưu lịch sử giao dịch */
        await queryRunner.manager.getRepository(Transaction).save(
          this.transactionRepository.create({
            cardCode: card.code,
            amount: cost,
            type: TransactionType.CHARGE,
          }),
        );
      }
      await queryRunner.commitTransaction();

      return { parking, slot, card, cost };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
