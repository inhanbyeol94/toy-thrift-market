import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Put, Req } from '@nestjs/common';
import { Member } from '../_common/entities';
import { MypageService } from './mypage.service';
import { UpdateMyPageDto } from '../_common/dtos/updateMypage.dto';
import { IMessage } from '../_common/interfaces/message.interface';
import { ChangeDto } from '../_common/dtos/changePw.dto';

@Controller('members')
export class MypageController {
  constructor(private mypageService: MypageService) {}

  // 회원정보 조회
  @Get('/mypage/:id')
  @HttpCode(201)
  async findUser(@Param('id') memberId: number): Promise<Member> {
    // const id = 1;
    return this.mypageService.findUser(memberId);
  }
  // 회원정보 수정
  @Patch('/mypage/:id')
  @HttpCode(200)
  async updateMember(@Param('id') memberId: number, @Body() data: UpdateMyPageDto): Promise<IMessage> {
    const id = 1;
    return await this.mypageService.updateMember(memberId, data.name, data.nickname, data.tel, data.address, data.subAddress, id);
  }
  // 비밀번호 변경
  @Put('/mypage/:id/password')
  @HttpCode(200)
  async changePassword(@Param('id') memberId: number, @Body() changePW: ChangeDto): Promise<IMessage> {
    return await this.mypageService.changePassword(memberId, changePW.password, changePW.confirmPassword);
  }
  // 회원 탈퇴
  @Delete('/mypage/:id')
  @HttpCode(200)
  async deleteMember(@Param('id') memberId: number): Promise<IMessage> {
    return await this.mypageService.deleteMember(memberId);
  }
}
