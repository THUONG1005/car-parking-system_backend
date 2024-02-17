import { Transform, TransformFnParams } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSlotDto {
  @IsNotEmpty({ message: 'Trạng thái không được để trống.' })
  @IsBoolean()
  readonly isFull: boolean;

  @IsOptional()
  @IsString({ message: 'Mô tả chứa ký tự không hợp lệ.' })
  @MaxLength(255, { message: 'Mô tả chứa tối đa 255 ký tự.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly description?: string;
}
