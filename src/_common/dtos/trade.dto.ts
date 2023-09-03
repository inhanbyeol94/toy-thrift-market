import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateTradeDto {
  @IsNumber()
  @IsNotEmpty()
  status: number;
}
