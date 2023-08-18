import { IsString, IsNumber } from 'class-validator';
export class SmallCategoryDto {
  @IsString()
  readonly name: string;

  @IsNumber()
  readonly middleCategoryId: number;
}
