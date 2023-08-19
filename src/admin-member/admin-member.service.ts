import { HttpException, NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../_common/entities';
import { IMessage } from '../_common/interfaces/message.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminMemberService {
  constructor(@InjectRepository(Member) private membersRepository: Repository<Member>) {}

  // async findAllMember(){}

  // async createMember(){}

  async updateAdminMember(id: number, name: string, nickname: string, password: string, tel: string, address: string, isAdmin: boolean): Promise<IMessage> {
    const member = await this.membersRepository.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException('회원이 존재하지 않습니다.');
    }
    const existingName = await this.membersRepository.findOne({ where: { name } });
    if (existingName && existingName.id != id) {
      throw new NotFoundException('이미 존재하는 이름입니다.');
    }
    const existingNickname = await this.membersRepository.findOne({ where: { nickname } });
    if (existingNickname && existingNickname.id != id) {
      throw new NotFoundException('이미 존재하는 닉네임입니다.');
    }
    const existingTel = await this.membersRepository.findOne({ where: { tel } });
    if (existingTel && existingTel.id != id) {
      throw new NotFoundException('이미 존재하는 번호입니다.');
    }
    member.name = name;
    member.nickname = nickname;
    member.tel = tel;
    member.address = address;
    member.isAdmin = isAdmin;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      member.password = hashedPassword;
    }
    await this.membersRepository.save(member);
    return { message: '회원 정보가 수정되었습니다.' };
  }
  // async deleteMember(){}
}
