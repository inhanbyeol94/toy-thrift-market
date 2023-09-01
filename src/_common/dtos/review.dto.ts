import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReViewDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class UpdateReViewDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
