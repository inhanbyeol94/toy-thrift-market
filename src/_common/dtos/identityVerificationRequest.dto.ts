import { IsDate, IsNotEmpty, IsNumber, IsString, Matches, MATCHES, MaxLength, MinLength } from 'class-validator';

export class VerificationRequestDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(12)
  @MaxLength(13)
  @Matches(/^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/)
  phone: string;

  @IsNumber()
  @IsNotEmpty()
  type: number;
}
