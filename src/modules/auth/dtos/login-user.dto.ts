import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({ message: 'Email không được để trống.' })
  @IsEmail({}, { message: 'Email có định dạng không hợp lệ.' })
  @MaxLength(50, { message: 'Email chứa tối đa 50 ký tự.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống.' })
  @IsString({ message: 'Mật khẩu chứa ký tự không hợp lệ.' })
  @MaxLength(255, { message: 'Mật khẩu chứa tối đa 255 ký tự.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly password: string;
}
