import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsDataURI,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { GenderType } from 'src/common/types';

export class UpdateUserInformationDto {
  @IsNotEmpty({ message: 'Tên đầy đủ không được để trống.' })
  @IsString({ message: 'Tên đầy đủ chứa ký tự không hợp lệ.' })
  @MaxLength(50, { message: 'Tên đầy đủ chứa tối đa 50 ký tự.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly fullName: string;

  @IsOptional()
  @IsDataURI()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  avatar?: string;

  @IsNotEmpty({ message: 'Ngày sinh không được để trống.' })
  @IsDateString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly birthday: Date;

  @IsNotEmpty({ message: 'Giới tính không được để trống.' })
  @IsEnum(GenderType)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly gender: GenderType;

  @IsNotEmpty({ message: 'Địa chỉ không được để trống.' })
  @IsString({ message: 'Địa chỉ chứa ký tự không hợp lệ.' })
  @MaxLength(50, { message: 'Địa chỉ chứa tối đa 50 ký tự.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly address: string;

  @IsNotEmpty({ message: 'Số điện thoại không được để trống.' })
  @Matches(/^(\+84){1}[0-9]{8,10}$/, {
    message: 'Số điện thoại chứa tối thiểu 8 chữ số, tối đa 10 chữ số.',
  })
  @Transform(({ value }: TransformFnParams) => '+84' + value?.trim())
  readonly phoneNumber: string;
}
