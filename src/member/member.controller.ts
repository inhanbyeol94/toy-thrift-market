import { Controller, HttpCode, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Req, Res, UseGuards } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from '../_common/dtos/members.dto';
import { IMessage } from '../_common/interfaces/message.interface';
import { UpdateMyPageDto } from '../_common/dtos/updateMypage.dto';
import { Member } from '../_common/entities';
import { ChangeDto } from '../_common/dtos/changePw.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteDto } from '../_common/dtos/delete.dto';
import { IRequest } from '../_common/interfaces/request.interface';
import { Response } from 'express';
import { AuthGuard } from 'src/_common/guards/auth.guard';
@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}
  // 회원가입
  @Post()
  @HttpCode(201)
  async createMember(@Body() memberData: CreateMemberDto): Promise<IMessage> {
    return await this.memberService.createMember(memberData);
  }
  // 회원정보 조회
  @Get()
  @HttpCode(201)
  async findUser(@Req() req: IRequest): Promise<Member> {
    const { id } = req.user;
    console.log(id);
    return this.memberService.findUser(id);
  }
  // 회원정보 수정
  @Patch()
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(200)
  async updateMember(@Req() req: IRequest, @Res() res: Response, @Body() data: UpdateMyPageDto, @UploadedFile() file: Express.Multer.File): Promise<Response> {
    const { id } = req.user;
    const { message, access_token } = await this.memberService.updateMember(id, data.name, data.nickname, data.tel, file, data.address, data.subAddress);
    res.cookie('access_token', access_token, { httpOnly: true });
    return res.status(200).json({ message });
  }
  // 비밀번호 변경
  @Patch('password')
  @HttpCode(200)
  async changePassword(@Req() req: IRequest, @Body() changePW: ChangeDto): Promise<IMessage> {
    const { id } = req.user;
    return await this.memberService.changePassword(id, changePW.password, changePW.confirmPassword);
  }
  // 회원 탈퇴
  @Delete()
  @HttpCode(200)
  async deleteMember(@Req() req: IRequest, @Body() password: DeleteDto): Promise<IMessage> {
    const { id } = req.user;
    return await this.memberService.deleteMember(id, password);
  }

  // 현재 사용자 확인
  @Get('current-user')
  @UseGuards(AuthGuard)
  async getCurrentUser(@Req() req: IRequest) {
    const user = req.user;
    return user;
  }
}
