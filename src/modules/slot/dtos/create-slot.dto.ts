import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateSlotDto {
  @IsNotEmpty({ message: 'Trạm không được để trống.' })
  @Matches(/^[0-9A-Z]{8}$/, { message: 'Trạm không hợp lệ.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly station: string;

  @IsNotEmpty({ message: 'Vị trí không được để trống.' })
  @IsPositive({ message: 'Vị trí phải là số nguyên dương.' })
  readonly position: number;

  @IsNotEmpty({ message: 'Trạng thái không được để trống.' })
  @IsBoolean()
  readonly isFull: boolean;

  @IsOptional()
  @IsString({ message: 'Mô tả chứa ký tự không hợp lệ.' })
  @MaxLength(255, { message: 'Mô tả chứa tối đa 255 ký tự.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly description?: string;
}
