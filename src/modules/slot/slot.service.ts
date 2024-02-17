import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slot } from './slot.entity';
import { SearchDto } from 'src/common/dtos';
import { CreateSlotDto, UpdateSlotDto } from './dtos';
import { getPagination } from 'src/common/utils/helper';

@Injectable()
export class SlotService {
  constructor(@InjectRepository(Slot) private readonly slotRepository: Repository<Slot>) {}

  async createSlot(createSlotDto: CreateSlotDto) {
    return await this.slotRepository.save(this.slotRepository.create(createSlotDto));
  }

  async getAllSlot(searchDto: SearchDto) {
    const { limit, offset } = getPagination(searchDto);

    const [list, count]: [Slot[], number] = await this.slotRepository
      .createQueryBuilder('slot')
      .limit(limit)
      .offset(offset)
      .orderBy('slot.id', 'DESC')
      .getManyAndCount();

    return {
      slots: list,
      currentItems: list.length,
      totalItems: count,
    };
  }

  async getSlotById(id: number) {
    return await this.slotRepository.findOneBy({ id });
  }

  async updateSlotById(id: number, updateSlotDto: UpdateSlotDto) {
    const isValidSlot: Slot = await this.slotRepository.findOneBy({ id });
    if (!isValidSlot) {
      throw new HttpException('Slot không tồn tại.', HttpStatus.NOT_FOUND);
    }

    return await this.slotRepository.save(
      this.slotRepository.create({
        ...isValidSlot,
        ...updateSlotDto,
      }),
    );
  }

  async countSlot() {
    const [totalSlot, emptySlot, fullSlot] = await Promise.all([
      this.slotRepository.createQueryBuilder('slot').select('COUNT(*)', 'totalSlot').getRawOne(),
      this.slotRepository
        .createQueryBuilder('slot')
        .select('COUNT(*)', 'emptySlot')
        .where('slot.is_full = false')
        .getRawOne(),
      this.slotRepository
        .createQueryBuilder('slot')
        .select('COUNT(*)', 'fullSlot')
        .where('slot.is_full = true')
        .getRawOne(),
    ]);

    return {
      totalSlot: totalSlot.totalSlot ? parseInt(totalSlot.totalSlot) : 0,
      emptySlot: emptySlot.emptySlot ? parseInt(emptySlot.emptySlot) : 0,
      fullSlot: fullSlot.fullSlot ? parseInt(fullSlot.fullSlot) : 0,
    };
  }

  async deleteSlotById(id: number) {
    return await this.slotRepository.delete(id);
  }
}
