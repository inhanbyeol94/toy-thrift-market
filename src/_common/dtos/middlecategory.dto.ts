import { IsNotEmpty, IsString } from 'class-validator';
class CreateMiddleCategoryDto {
  @IsString()
  name: string;

  @IsNotEmpty()
  largeCategoryId: number;
}
export { CreateMiddleCategoryDto };
