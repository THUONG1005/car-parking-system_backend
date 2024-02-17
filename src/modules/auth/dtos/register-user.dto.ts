import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsDataURI,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { GenderType } from 'src/common/types';

export class RegisterUserDto {
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

  @IsNotEmpty({ message: 'Email không được để trống.' })
  @IsEmail({}, { message: 'Email có định dạng không hợp lệ.' })
  @MaxLength(50, { message: 'Email chứa tối đa 50 ký tự.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{}|;':",./<>?])\S{8,255}$/, {
    message:
      'Mật khẩu chứa tối thiểu 8 ký tự, tối đa 255 ký tự và có ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt.',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly password: string;
}
