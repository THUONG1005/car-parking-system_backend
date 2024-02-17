import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, Matches, MaxLength } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsNotEmpty({ message: 'Mật khẩu hiện tại không được để trống.' })
  @MaxLength(255, {
    message: 'Mật khẩu hiện tại chứa tối đa 255 ký tự.',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly currentPassword: string;

  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{}|;':",./<>?])\S{8,255}$/, {
    message:
      'Mật khẩu mới chứa tối thiểu 8 ký tự, tối đa 255 ký tự và có ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt.',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly newPassword: string;

  @IsNotEmpty({ message: 'Mật khẩu mới nhập lại không được để trống.' })
  @MaxLength(255, {
    message: 'Mật khẩu mới nhập lại chứa tối đa 255 ký tự.',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly reNewPassword: string;
}
