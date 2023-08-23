import { IsBoolean, IsNotEmpty, IsString, Matches } from 'class-validator';

class BoardDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/[가-힣]/)
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  documentAuthority: boolean;

  @IsBoolean()
  @IsNotEmpty()
  commentAuthority: boolean;
}

export { BoardDto };
