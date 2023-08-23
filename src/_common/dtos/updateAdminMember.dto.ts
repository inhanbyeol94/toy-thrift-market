import { IsBoolean, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

class UpdateAdminMemberDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  @MinLength(2)
  @Matches(/[가-힣]/)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @MinLength(2)
  @Matches(/^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/)
  nickname: string;

  @IsString()
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(13)
  @Matches(/^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/)
  tel: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  subAddress: string;

  @IsBoolean()
  @IsNotEmpty()
  isAdmin: boolean;
}

export { UpdateAdminMemberDto };
