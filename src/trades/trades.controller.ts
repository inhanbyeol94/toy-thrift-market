import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode } from '@nestjs/common';
import { TradesService } from './trades.service';
import { AuthGuard } from 'src/_common/guards/auth.guard';
import { IRequest } from 'src/_common/interfaces/request.interface';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { AdminGuard } from 'src/_common/guards/admin.guard';
import { Trade } from 'src/_common/entities';

@Controller('trades')
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  // 거래 목록 조회(관리자)
  @Get()
  @UseGuards(AdminGuard)
  async tradeget(): Promise<Trade[]> {
    return await this.tradesService.tradeget();
  }

  // 상품거래 취소(관리자)
  // @Patch('cancle/:id')
  // @UseGuards(AdminGuard)
  // async tradeCancle(@Param('id') tradeId: number) {
  //   return await this.tradesService.tradeCancle(tradeId);
  // }
}
