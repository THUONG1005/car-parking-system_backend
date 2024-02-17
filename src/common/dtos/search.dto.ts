import { Transform, TransformFnParams } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class SearchDto {
  @IsOptional()
  @IsString({ message: 'Số trang chứa ký tự không hợp lệ.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly page?: string = '1';

  @IsOptional()
  @IsString({ message: 'Giới hạn phần tử chứa ký tự không hợp lệ.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly limit?: string = '10';

  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm chứa ký tự không hợp lệ.' })
  @Transform(({ value }: TransformFnParams) => '%' + value?.trim() + '%')
  readonly keyword?: string = '%%';
}
