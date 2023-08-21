import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsNumber()
  memberId: number;

  @IsNotEmpty()
  @IsNumber()
  smallCategoryId: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  productStatus: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  count: number;
}
