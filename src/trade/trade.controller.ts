import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TradeService } from './trade.service';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { AuthGuard } from 'src/_common/guards/auth.guard';
import { IRequest } from 'src/_common/interfaces/request.interface';

@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  // 거래 상태 조회
  @Get(':id')
  @UseGuards(AuthGuard)
  async getsatus(@Param('id') productId: string) {
    return await this.tradeService.getsatus(+productId);
  }

  // 상품 거래 완료
  @Patch('complete/:id')
  @UseGuards(AuthGuard)
  async update(@Param('id') productId: string): Promise<IMessage> {
    const status = 2;
    return await this.tradeService.update(+productId, status);
  }
}
