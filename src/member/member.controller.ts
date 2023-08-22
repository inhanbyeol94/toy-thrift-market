import { Controller, HttpCode, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from '../_common/dtos/members.dto';
import { IMessage } from '../_common/interfaces/message.interface';
import { UpdateMyPageDto } from '../_common/dtos/updateMypage.dto';
import { Member } from '../_common/entities';
import { ChangeDto } from '../_common/dtos/changePw.dto';

@Controller('members')
export class MemberController {
  constructor(private memberService: MemberService) {}
  // 회원가입
  @Post()
  @HttpCode(201)
  async createMember(@Body() memberData: CreateMemberDto): Promise<IMessage> {
    return await this.memberService.createMember(memberData);
  }
  // 회원정보 조회
  @Get()
  @HttpCode(201)
  async findUser(): Promise<Member> {
    const id = 4;
    return this.memberService.findUser(id);
  }
  // 회원정보 수정
  @Patch()
  @HttpCode(200)
  async updateMember(@Body() data: UpdateMyPageDto): Promise<IMessage> {
    const id = 4;
    return await this.memberService.updateMember(id, data.name, data.nickname, data.tel, data.profileImage, data.address, data.subAddress);
  }
  // 비밀번호 변경
  @Patch('/members/:id/password')
  @HttpCode(200)
  async changePassword(@Param('id') memberId: number, @Body() changePW: ChangeDto): Promise<IMessage> {
    return await this.memberService.changePassword(memberId, changePW.password, changePW.confirmPassword);
  }
  // 회원 탈퇴
  @Delete()
  @HttpCode(200)
  async deleteMember(@Param('id') memberId: number): Promise<IMessage> {
    return await this.memberService.deleteMember(memberId);
  }
}
