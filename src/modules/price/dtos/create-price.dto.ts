import { Transform, TransformFnParams } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';
import { CardType } from 'src/common/types';

export class CreatePriceDto {
  @IsNotEmpty({ message: 'Giá không được để trống.' })
  @IsInt({ message: 'Giá phải là số nguyên.' })
  @Min(0, { message: 'Giá không được nhỏ hơn 0.' })
  readonly value: number;

  @IsNotEmpty({ message: 'Loại giá không được để trống.' })
  @IsEnum(CardType)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly type: CardType;
}
