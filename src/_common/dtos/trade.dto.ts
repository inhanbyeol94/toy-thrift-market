import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateTradeDto {
  @IsNumber()
  @IsNotEmpty()
  status: number;

  @IsString()
  @IsNotEmpty()
  buyerAccountNumber: number;
}
