import { Controller, HttpCode, Post, Body, Req, UseGuards, Get, Patch, Param, UseInterceptors, Res } from '@nestjs/common';
import { AdminMainboardService } from './admin-mainboard.service';
import { MainPage } from '../_common/schema/like.schema';
import { IMessage } from '../_common/interfaces/message.interface';
import { IRequest } from '../_common/interfaces/request.interface';
import { AdminGuard } from '../_common/guards/admin.guard';
import { MainBoardDto } from '../_common/dtos/mainboard.dto';

@Controller('admin-mainboards')
export class AdminMainPageController {
  constructor(private readonly adminMainPageService: AdminMainboardService) {}
  // 생성
  @Post()
  @UseGuards(AdminGuard)
  @HttpCode(201)
  async createPost(@Body() mainList: any, @Req() req: IRequest): Promise<IMessage> {
    const files = req.files[0]?.location;
    await this.adminMainPageService.upsertMainpage(mainList, files);
    return { message: '생성 완료' };
  }
  /** 수정  **/
  @Patch()
  @UseGuards(AdminGuard)
  @HttpCode(200)
  async updatePost(@Body() mainList: MainBoardDto, @Req() req: IRequest): Promise<IMessage> {
    const files = req.files[0]?.location;
    await this.adminMainPageService.upsertMainpage(mainList, files);
    return { message: '생성 완료' };
  }

  // 메인페이지 조회
  @Get()
  @HttpCode(200)
  findmainBoard(): Promise<MainPage[]> {
    return this.adminMainPageService.findmainBoard();
  }

  // 메인페이지 수정
  // @Patch(':id')
  // @UseGuards(AdminGuard)
  // @HttpCode(200)
  // async editmainBoard(@Param('id') id: string, @Body() updateBoard: any): Promise<IMessage> {
  //   return await this.adminMainPageService.editmainBoard(id, updateBoard);
  // }
}
