import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLargeCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateLargeCategoryDto extends CreateLargeCategoryDto {}
