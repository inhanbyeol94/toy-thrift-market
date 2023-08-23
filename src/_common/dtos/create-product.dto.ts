import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  // @IsNotEmpty()
  // @IsNumber()
  // smallCategoryId: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}
