import { IsDate, IsNotEmpty, IsNumber, IsString, Matches, MATCHES, MaxLength, MinLength } from 'class-validator';

export class IdentityVerifyDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(12)
  @MaxLength(13)
  @Matches(/^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/)
  phone: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  sequence: number;
}
