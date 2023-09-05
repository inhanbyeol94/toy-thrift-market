import {Controller, Post, Param, UseGuards, HttpCode, Req, Get} from '@nestjs/common';
import { PickService } from './pick.service';
import { AuthGuard } from 'src/_common/guards/auth.guard';
import { IRequest } from 'src/_common/interfaces/request.interface';
import { IMessage } from 'src/_common/interfaces/message.interface';

@Controller('pick')
export class PickController {
  constructor(private readonly pickService: PickService) {}
  // 찜 생성
  @Post(':productId')
  @UseGuards(AuthGuard)
  @HttpCode(201)
  async createPick(@Req() req: IRequest, @Param('productId') productId: number): Promise<IMessage> {
    const { id } = req.user;
    return await this.pickService.createPick(id, productId);
  }

  // 찜 한 목록 불러오기
  @Get('mypick/category/get/:id')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async getMyPicks(@Param('id') categoryId: number, @Req() req: IRequest) {
    const { id } = req.user;
    return await this.pickService.getMyPicks(id,categoryId)
  }
}
