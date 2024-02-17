import { Transform, TransformFnParams } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';
import { CardType } from 'src/common/types';

export class UpdateCardDto {
  @IsNotEmpty({ message: 'Loại thẻ không được để trống.' })
  @IsEnum(CardType)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly type: CardType;

  @IsNotEmpty({ message: 'Số tiền nạp không được để trống.' })
  @IsInt({ message: 'Số tiền nạp phải là số nguyên.' })
  @Min(0, { message: 'Số tiền nạp không được nhỏ hơn 0.' })
  readonly addAmount: number;
}
