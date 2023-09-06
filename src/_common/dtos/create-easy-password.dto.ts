import { IsNotEmpty, IsNumberString, IsString, Length, Matches } from 'class-validator';

export class CreateEasyPasswordDto {
  @IsNotEmpty()
  @IsString()
  @Length(16, 16)
  @Matches(/^\d{6}-\d{2}-\d{6}$/)
  bankAccountNumber: string;

  @IsNotEmpty()
  @IsNumberString({})
  @Length(6, 6)
  easyPassword: string;
}
