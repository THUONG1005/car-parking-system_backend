import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { SearchDto } from 'src/common/dtos';
import { getPagination } from 'src/common/utils/helper';
import { TransactionType } from 'src/common/types';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getAllTransaction(searchDto: SearchDto) {
    const { limit, offset, keyword } = getPagination(searchDto);

    const [list, count]: [Transaction[], number] = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.card_code ilike :keyword', { keyword })
      .limit(limit)
      .offset(offset)
      .orderBy('transaction.id', 'DESC')
      .getManyAndCount();

    return {
      transactions: list,
      currentItems: list.length,
      totalItems: count,
    };
  }

  async countTransaction() {
    const [totalTransaction, recharge, charge] = await Promise.all([
      this.transactionRepository
        .createQueryBuilder('transaction')
        .select('SUM(transaction.amount)', 'totalTransaction')
        .getRawOne(),
      this.transactionRepository
        .createQueryBuilder('transaction')
        .select('SUM(transaction.amount)', 'recharge')
        .where('transaction.type = :transactionType', { transactionType: TransactionType.RECHARGE })
        .getRawOne(),
      this.transactionRepository
        .createQueryBuilder('transaction')
        .select('SUM(transaction.amount)', 'charge')
        .where('transaction.type = :transactionType', { transactionType: TransactionType.CHARGE })
        .getRawOne(),
    ]);

    return {
      totalTransaction: totalTransaction.totalTransaction
        ? parseInt(totalTransaction.totalTransaction)
        : 0,
      recharge: recharge.recharge ? parseInt(recharge.recharge) : 0,
      charge: charge.charge ? parseInt(charge.charge) : 0,
    };
  }

  async getTransactionById(id: number) {
    return await this.transactionRepository.findOneBy({ id });
  }

  async deleteTransactionById(id: number) {
    return await this.transactionRepository.delete(id);
  }
}
