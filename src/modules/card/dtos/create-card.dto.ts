import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { CardType } from 'src/common/types';

export class CreateCardDto {
  @IsNotEmpty({ message: 'Mã thẻ không được để trống.' })
  @Matches(/^[0-9ABCDEF]{8}$/, { message: 'Mã thẻ không hợp lệ.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly code: string;

  @IsNotEmpty({ message: 'Loại thẻ không được để trống.' })
  @IsEnum(CardType)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly type: CardType;

  @IsNotEmpty({ message: 'Số tiền không được để trống.' })
  @IsInt({ message: 'Số tiền phải là số nguyên.' })
  @Min(0, { message: 'Số tiền không được nhỏ hơn 0.' })
  readonly amount: number;

  @IsOptional()
  @IsEmail({}, { message: 'Email có định dạng không hợp lệ.' })
  @MaxLength(50, { message: 'Email chứa tối đa 50 ký tự.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly userEmail?: string;
}
