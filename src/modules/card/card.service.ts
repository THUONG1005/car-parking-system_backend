import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Card } from './card.entity';
import { CreateCardDto, UpdateCardDto } from './dtos';
import { SearchDto } from 'src/common/dtos';
import { getPagination } from 'src/common/utils/helper';
import { Transaction } from '../transaction/transaction.entity';
import { CardType, TransactionType } from 'src/common/types';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,

    private readonly dataSource: DataSource,
  ) {}

  async createCard(createCardDto: CreateCardDto) {
    const card: Card = await this.cardRepository.findOneBy({ code: createCardDto.code });
    if (card) {
      throw new HttpException('Thẻ đã tồn tại.', HttpStatus.CONFLICT);
    }

    return await this.cardRepository.save(this.cardRepository.create(createCardDto));
  }

  async getAllCard(searchDto: SearchDto) {
    const { limit, offset, keyword } = getPagination(searchDto);

    const [list, count]: [Card[], number] = await this.cardRepository
      .createQueryBuilder('card')
      .where('card.code ilike :keyword', { keyword })
      .limit(limit)
      .offset(offset)
      .orderBy('card.id', 'ASC')
      .getManyAndCount();

    return {
      cards: list,
      currentItems: list.length,
      totalItems: count,
    };
  }

  async countCard() {
    const [totalCard, guestCard, normalCard, premiumCard] = await Promise.all([
      this.cardRepository.createQueryBuilder('card').select('COUNT(*)', 'totalCard').getRawOne(),
      this.cardRepository
        .createQueryBuilder('card')
        .select('COUNT(*)', 'guestCard')
        .where('card.type = :cardType', { cardType: CardType.GUEST })
        .getRawOne(),
      this.cardRepository
        .createQueryBuilder('card')
        .select('COUNT(*)', 'normalCard')
        .where('card.type = :cardType', { cardType: CardType.NORMAL })
        .getRawOne(),
      this.cardRepository
        .createQueryBuilder('card')
        .select('COUNT(*)', 'premiumCard')
        .where('card.type = :cardType', { cardType: CardType.PREMIUM })
        .getRawOne(),
    ]);

    return {
      totalCard: totalCard.totalCard ? parseInt(totalCard.totalCard) : 0,
      guestCard: guestCard.guestCard ? parseInt(guestCard.guestCard) : 0,
      normalCard: normalCard.normalCard ? parseInt(normalCard.normalCard) : 0,
      premiumCard: premiumCard.premiumCard ? parseInt(premiumCard.premiumCard) : 0,
    };
  }

  async getCardById(id: number) {
    return await this.cardRepository.findOneBy({ id });
  }

  async updateCardById(id: number, updateCardDto: UpdateCardDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let card: Card = await this.cardRepository.findOneBy({ id });
    if (!card) {
      throw new HttpException('Thông tin không tồn tại.', HttpStatus.NOT_FOUND);
    }

    try {
      if (updateCardDto.addAmount > 0 && updateCardDto.type != CardType.GUEST) {
        await queryRunner.manager.getRepository(Transaction).save(
          this.transactionRepository.create({
            cardCode: card.code,
            amount: updateCardDto.addAmount,
            type: TransactionType.RECHARGE,
          }),
        );
      }

      card = await queryRunner.manager.getRepository(Card).save(
        this.cardRepository.create({
          ...card,
          type: updateCardDto.type,
          amount: updateCardDto.addAmount + card.amount,
        }),
      );

      await queryRunner.commitTransaction();

      return card;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteCardById(id: number) {
    return await this.cardRepository.delete(id);
  }
}
