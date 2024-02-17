import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, Matches } from 'class-validator';

export class CardCodeDto {
  @IsNotEmpty({ message: 'Mã thẻ không được để trống.' })
  @Matches(/^[0-9ABCDEF]{8}$/, { message: 'Mã thẻ không hợp lệ.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly cardCode: string;
}
