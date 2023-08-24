import { IsNumber, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/[ㄱ-ㅎ가-힣a-zA-Z0-9\s~`!@#$%^&*()_+=[\]{}|\\;:'",<.>?/-]+$/)
  content: string;

  @IsNumber()
  @IsNotEmpty()
  documentId: number;
}
