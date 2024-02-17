import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Price } from './price.entity';
import { Repository } from 'typeorm';
import { SearchDto } from 'src/common/dtos';
import { getPagination } from 'src/common/utils/helper';
import { CreatePriceDto } from './dtos';

@Injectable()
export class PriceService {
  constructor(@InjectRepository(Price) private readonly priceRepository: Repository<Price>) {}

  async createPrice(createPriceDto: CreatePriceDto) {
    return await this.priceRepository.save(this.priceRepository.create(createPriceDto));
  }

  async updatePrice(id: number, value: number) {
    const price: Price = await this.priceRepository.findOneBy({ id });
    if (!price) {
      throw new HttpException('Thông tin không tồn tại.', HttpStatus.NOT_FOUND);
    }

    return await this.priceRepository.save(
      this.priceRepository.create({
        ...price,
        value: value,
      }),
    );
  }

  async getPriceById(id: number) {
    return await this.priceRepository.findOneBy({ id });
  }

  async getAllPrice(searchDto: SearchDto) {
    const { limit, offset } = getPagination(searchDto);

    const [list, count]: [Price[], number] = await this.priceRepository
      .createQueryBuilder('price')
      .limit(limit)
      .offset(offset)
      .orderBy('price.id', 'ASC')
      .getManyAndCount();

    return {
      prices: list,
      currentItems: list.length,
      totalItems: count,
    };
  }

  async deletePriceById(id: number) {
    return await this.priceRepository.delete(id);
  }
}
