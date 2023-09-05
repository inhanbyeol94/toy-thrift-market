import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode } from '@nestjs/common';
import { TradesService } from './trades.service';
import { AuthGuard } from 'src/_common/guards/auth.guard';
import { IRequest } from 'src/_common/interfaces/request.interface';
import { IMessage } from 'src/_common/interfaces/message.interface';

@Controller('trades')
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}
}
