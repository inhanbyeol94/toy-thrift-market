import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumberString, IsString, Length, Matches, MaxLength } from 'class-validator';

export class VerifyAccountNumberDto {
  @IsNotEmpty()
  @IsString()
  @Length(16, 16)
  @Matches(/^\d{6}-\d{2}-\d{6}$/)
  bankAccountNumber: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(13)
  @Matches(/^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/)
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  accountHolder: string;

  @IsNotEmpty()
  @IsString()
  @Length(14, 14)
  @Matches(/^\d{6}-\d{7}$/)
  residentRegistrationNumber: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(4, 4)
  password: string;
}

export class RequestIdentityVerificationDto extends PartialType(VerifyAccountNumberDto) {}

export class VerifyIdentityDto extends PartialType(VerifyAccountNumberDto) {
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  verificationCode: string;
}
