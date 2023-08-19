import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class LargeCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class SmallCategoryDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNumber()
  readonly middleCategoryId: number;
}

export class UpdateCategoryDto extends LargeCategoryDto {}
