import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

class CreateMemberDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  @MinLength(2)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @MinLength(2)
  nickname: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(13)
  tel: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}

export { CreateMemberDto };
