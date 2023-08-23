import { IsNotEmpty, IsString } from 'class-validator';

export class SearchProductDto {
  @IsNotEmpty()
  @IsString()
  searchString: string;
}
