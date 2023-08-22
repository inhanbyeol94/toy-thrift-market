import { IsBoolean, IsNumber, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/)
  content: string;

  @IsBoolean()
  @IsNotEmpty()
  isSecret: boolean;

  @IsNumber()
  @IsNotEmpty()
  memberId: number;

  @IsNumber()
  @IsNotEmpty()
  boardId: number;
}
