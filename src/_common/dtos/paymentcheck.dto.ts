import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class PaymemberCheckDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  tel: string;

  @IsString()
  @IsNotEmpty()
  resistNumber: string;
}

export class PayverifyDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsNumber()
  @IsNotEmpty()
  code: number;

  @IsNumber()
  @IsNotEmpty()
  sequence: number;
}

export class PayAccountCheckDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  resistNumber: string;

  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  @IsNotEmpty()
  sequence: number;
}
