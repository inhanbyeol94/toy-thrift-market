import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode } from '@nestjs/common';
import { TradesService } from './trades.service';
import { AuthGuard } from 'src/_common/guards/auth.guard';
import { IRequest } from 'src/_common/interfaces/request.interface';
import { IMessage } from 'src/_common/interfaces/message.interface';

@Controller('trades')
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  // 상품 거래 완료
  @Patch('complete/:id')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async update(@Param('id') productId: string, @Req() req: IRequest): Promise<IMessage> {
    const status = 2;
    const { id } = req.user;
    return await this.tradesService.update(+productId, status, id);
  }

  // 상품 거래 생성
  @Patch(':id')
  @UseGuards(AuthGuard)
  @HttpCode(201)
  async create(@Param('id') productId: string, @Req() req: IRequest): Promise<IMessage> {
    const { id } = req.user;
    return await this.tradesService.create(+productId, id);
  }
}
