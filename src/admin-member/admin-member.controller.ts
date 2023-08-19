import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { AdminMemberService } from './admin-member.service';
import { IMessage } from '../_common/interfaces/message.interface';
import { Member } from '../_common/entities';
import { CreateMemberDto } from '../_common/dtos/members.dto';

@Controller('admin-members')
export class AdminMemberController {
  constructor(private adminMemberService: AdminMemberService) {}

  // 회원(Member) 조회
  @Get()
  @HttpCode(200)
  async findMember(): Promise<Member[]> {
    return await this.adminMemberService.findMember();
  }
  // 회원(Member) 추가
  @Post()
  @HttpCode(201)
  async createMember(@Body() resisterData: CreateMemberDto): Promise<IMessage> {
    return await this.adminMemberService.createMember(resisterData);
  }

  // @Patch()

  // @Delete()
}
