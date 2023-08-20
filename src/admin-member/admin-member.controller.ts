import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { AdminMemberService } from './admin-member.service';
import { IMessage } from '../_common/interfaces/message.interface';

@Controller('admin-members')
export class AdminMemberController {
  constructor(private adminMemberService: AdminMemberService) {}

  // @Get()

  // @Post()

  // @Patch()

  @Delete('/:id')
  @HttpCode(200)
  async deleteMember(@Param('id') id: number): Promise<IMessage> {
    return await this.adminMemberService.deleteMember(id);
  }
}
