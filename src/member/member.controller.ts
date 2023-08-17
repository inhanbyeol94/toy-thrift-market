import { Controller, HttpCode, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from '../_common/dtos/members.dto';
import { IResult } from '../_common/interfaces/return.interface';

@Controller('members')
export class MemberController {
  constructor(private memberService: MemberService) {}
  // 회원가입
  @Post()
  @HttpCode(201)
  async createMember(@Body() memberData: CreateMemberDto): Promise<IResult> {
    return await this.memberService.createMember(memberData);
  }
}
