import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { EasyPasswordService } from './easy-password.service';
import { CreateEasyPasswordDto } from '../_common/dtos/create-easy-password.dto';
import { UpdateEasyPasswordDto } from 'src/_common/dtos/update-easy-password.dto';
import { IRequest } from 'src/_common/interfaces/request.interface';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { AuthGuard } from 'src/_common/guards/auth.guard';

@Controller('easy-passwords')
@UseGuards(AuthGuard)
export class EasyPasswordController {
  constructor(private readonly easyPasswordService: EasyPasswordService) {}

  // 간편비밀번호 등록
  @Post()
  async create(@Body() createEasyPasswordDto: CreateEasyPasswordDto, @Req() req: IRequest): Promise<IMessage> {
    const { id: memberId } = req.user;
    return await this.easyPasswordService.create(createEasyPasswordDto, memberId);
  }

  // 등록된 계좌 조회
  @Get()
  findAllByMemberId(@Req() req: IRequest) {
    const { id: memberId } = req.user;
    return this.easyPasswordService.findAllByMemberId(memberId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.easyPasswordService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEasyPasswordDto: UpdateEasyPasswordDto) {
  //   return this.easyPasswordService.update(+id, updateEasyPasswordDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.easyPasswordService.remove(+id);
  // }
}
