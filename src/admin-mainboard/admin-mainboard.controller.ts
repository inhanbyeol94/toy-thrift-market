import { Controller, HttpCode, Post, Body, Req, UseGuards, Get, Patch } from '@nestjs/common';
import { AdminMainboardService } from './admin-mainboard.service';
import { MainPage } from '../_common/schema/like.schema';
import { IMessage } from '../_common/interfaces/message.interface';
import { IRequest } from '../_common/interfaces/request.interface';
import { AuthGuard } from '../_common/guards/auth.guard';
import { AdminGuard } from '../_common/guards/admin.guard';

@Controller('admin-mainboards')
export class AdminMainPageController {
  constructor(private readonly adminMainPageService: AdminMainboardService) {}
  // 생성 Test
  @Post()
  @UseGuards(AdminGuard)
  @HttpCode(201)
  async createPost(@Body() mainList: any): Promise<IMessage> {
    console.log(mainList);
    await this.adminMainPageService.createPost(mainList);
    return { message: '생성 완료' };
  }

  // 메인페이지 조회
  @Get()
  @HttpCode(200)
  findmainBoard(): Promise<MainPage[]> {
    return this.adminMainPageService.findmainBoard();
  }

  // 메인페이지 수정
  @Patch()
  // @UseGuards(AdminGuard)
  @HttpCode(200)
  async editmainBoard(@Body() updateBoard: any): Promise<IMessage> {
    return await this.adminMainPageService.editmainBoard(updateBoard);
  }
}
