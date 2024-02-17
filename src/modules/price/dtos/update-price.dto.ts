import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdatePriceDto {
  @IsNotEmpty({ message: 'Giá không được để trống.' })
  @IsInt({ message: 'Giá phải là số nguyên.' })
  @Min(0, { message: 'Giá không được nhỏ hơn 0.' })
  readonly value: number;
}
