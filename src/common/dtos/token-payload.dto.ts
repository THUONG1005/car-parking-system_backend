import { IsNotEmpty, IsPositive } from 'class-validator';

export class TokenPayloadDto {
  @IsNotEmpty({ message: 'id không được để trống.' })
  @IsPositive({ message: 'id phải là số nguyên dương.' })
  readonly id: number;
}
