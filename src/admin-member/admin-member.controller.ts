import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { AdminMemberService } from './admin-member.service';
import { IMessage } from '../_common/interfaces/message.interface';
import { UpdateAdminMemberDto } from '../_common/dtos/updateAdminMember.dto';
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

  // 회원(Member) 수정
  @Patch('/:id')
  @HttpCode(200)
  async updateAdminMember(@Param('id') memberId: number, @Body() data: UpdateAdminMemberDto): Promise<IMessage> {
    const id = 1;
    return await this.adminMemberService.updateAdminMember(memberId, data.name, data.nickname, data.password, data.tel, data.address, data.subAddress, data.isAdmin, id);
  }

  // 회원(Member) 삭제
  @Delete('/:id')
  @HttpCode(200)
  async deleteMember(@Param('id') id: number): Promise<IMessage> {
    return await this.adminMemberService.deleteMember(id);
  }
}
