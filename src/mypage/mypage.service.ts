import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '../_common/entities';
import { Repository } from 'typeorm';

import { IMessage } from '../_common/interfaces/message.interface';
import * as bcrypt from 'bcrypt';
@Injectable()
export class MypageService {
  constructor(@InjectRepository(Member) private mypageRepository: Repository<Member>) {}

  // 회원정보 조회
  async findUser(id: number): Promise<Member> {
    return this.mypageRepository.findOne({ where: { id } });
  }
  // 회원정보 수정
  async updateMember(memberId: number, name: string, nickname: string, tel: string, address: string, subAddress: string, id: number): Promise<IMessage> {
    const member = await this.mypageRepository.findOne({ where: { id: memberId } });
    if (!member) {
      throw new NotFoundException('회원이 존재하지 않습니다.');
    }
    const existingNickname = await this.mypageRepository.findOne({ where: { nickname } });
    if (existingNickname) {
      throw new NotFoundException('이미 존재하는 닉네임입니다.');
    }
    const existingTel = await this.mypageRepository.findOne({ where: { tel } });
    if (existingTel) {
      throw new NotFoundException('이미 존재하는 전화번호입니다.');
    }
    member.name = name;
    member.nickname = nickname;
    member.tel = tel;
    member.address = address;
    member.subAddress = subAddress;
    await this.mypageRepository.save(member);
    return { message: '회원 정보가 수정되었습니다.' };
  }

  // 비밀번호 변경
  async changePassword(memberId: number, password: string, confirmPassword: string): Promise<IMessage> {
    const member = await this.mypageRepository.findOne({ where: { id: memberId } });
    if (!member) {
      throw new NotFoundException('회원이 존재하지 않습니다.');
    }

    const oldPassword = await bcrypt.compare(password, member.password);
    if (!oldPassword) {
      throw new NotFoundException('기존 비밀번호가 올바르지 않습니다.');
    }
    const newPassword = await bcrypt.hash(confirmPassword, 10);
    member.password = newPassword;
    await this.mypageRepository.save(member);
    return { message: '비밀번호가 변경되었습니다.' };
  }
  // 회원탈퇴
  async deleteMember(memberId: number): Promise<IMessage> {
    const existingMember = await this.mypageRepository.findOne({ where: { id: memberId } });
    if (!existingMember) {
      throw new NotFoundException('회원이 존재하지 않습니다.');
    }

    await this.mypageRepository.softDelete(memberId);
    return { message: '회원 탈퇴가 완료되었습니다.' };
  }
}
