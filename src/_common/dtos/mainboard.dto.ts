import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MainBoardDto {
  @IsString()
  @IsNotEmpty()
  mainTitle: string;

  @IsString()
  @IsNotEmpty()
  subTitle: string;

  @IsString()
  @IsNotEmpty()
  bottomTitle: string;

  @IsString()
  @IsNotEmpty()
  bottomColor: string;

  @IsString()
  @IsNotEmpty()
  icon1: string;

  @IsString()
  @IsNotEmpty()
  title1: string;

  @IsString()
  @IsNotEmpty()
  content1: string;

  @IsString()
  @IsNotEmpty()
  icon2: string;

  @IsString()
  @IsNotEmpty()
  title2: string;

  @IsString()
  @IsNotEmpty()
  content2: string;

  @IsString()
  @IsNotEmpty()
  icon3: string;

  @IsString()
  @IsNotEmpty()
  title3: string;

  @IsString()
  @IsNotEmpty()
  content3: string;

  @IsString()
  @IsNotEmpty()
  icon4: string;

  @IsString()
  @IsNotEmpty()
  title4: string;

  @IsString()
  @IsNotEmpty()
  content4: string;
}
