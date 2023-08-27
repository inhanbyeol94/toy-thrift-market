import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateProductImagePositionDto {
  @IsNumber()
  @IsNotEmpty()
  prev: number;

  @IsNumber()
  @IsNotEmpty()
  next: number;

  @IsNumber()
  @IsNotEmpty()
  id: number;
}
