import { IsString, IsNumber } from 'class-validator';
export class SmallCategoryDto {
  @IsString()
  readonly name: string;

  @IsNumber()
  readonly middle_category_id: number;
}
