import { IsString } from 'class-validator';
class CreateMiddleCategoryDto {
  @IsString()
  name: string;
}
export { CreateMiddleCategoryDto };
