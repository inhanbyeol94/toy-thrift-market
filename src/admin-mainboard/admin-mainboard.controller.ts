import { Controller, HttpCode, Post, Body } from '@nestjs/common';
import { AdminMainboardService } from './admin-mainboard.service';
import { MainPage } from '../_common/schema/like.schema';
import { IMessage } from '../_common/interfaces/message.interface';
@Controller('admin-mainboards')
export class AdminMainPageController {
  constructor(private readonly adminMainPageService: AdminMainboardService) {}
  // 메인페이지 조회
  // @Get()
  // @HttpCode(200)
  // async findmainBoard(@Req() req: IRequest): Promise<MainPage[]> {
  //   const { id } = req.user;
  //   return await this.adminMainPageService.findmainBard(id);
  // }

  // test code 생성
  @Post()
  @HttpCode(201)
  async createPost(@Body() mainList: MainPage): Promise<IMessage> {
    await this.adminMainPageService.createPost(mainList);
    return { message: '테스트 완료' };
  }
}
