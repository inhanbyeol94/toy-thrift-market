import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from '../_common/dtos/members.dto';
import { Repository } from 'typeorm';
import { Member } from '../_common/entities/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IMessage } from '../_common/interfaces/message.interface';
import * as bcrypt from 'bcrypt';
@Injectable()
export class MemberService {
  constructor(@InjectRepository(Member) private membersRepository: Repository<Member>) {}
  //회원가입
  async createMember(createMember: CreateMemberDto): Promise<IMessage> {
    const { email, nickname, tel } = createMember;
    // 존재하는 이메일이 있을때
    const existingEmail = await this.membersRepository.findOne({ where: { email } });
    if (existingEmail) throw new HttpException('이미 존재하는 이메일 입니다.', 403);
    // 존재하는 닉네임이 있을때
    const existingNickname = await this.membersRepository.findOne({ where: { nickname } });
    if (existingNickname) throw new HttpException('이미 존재하는 닉네임 입니다.', 403);
    // 존재하는 전화번호가 있을때
    const existingTel = await this.membersRepository.findOne({ where: { tel } });
    if (existingTel) throw new HttpException('이미 존재하는 전화번호 입니다.', 403);
    // 암호 복호화
    createMember.password = await bcrypt.hash(createMember.password, 10);
    const newMember = this.membersRepository.create(createMember);
    await this.membersRepository.save(newMember);
    return { message: '회원가입이 완료되었습니다.' };
  }
  // 회원정보 조회
  async findUser(id: number): Promise<Member> {
    return await this.membersRepository.findOne({ where: { id } });
  }
  // 회원정보 수정
  async updateMember(id: number, name: string, nickname: string, tel: string, profileImage: string, address: string, subAddress: string): Promise<IMessage> {
    const member = await this.membersRepository.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException('회원이 존재하지 않습니다.');
    }
    const existingNickname = await this.membersRepository.findOne({ where: { nickname } });
    if (existingNickname) {
      throw new NotFoundException('이미 존재하는 닉네임입니다.');
    }
    const existingTel = await this.membersRepository.findOne({ where: { tel } });
    if (existingTel) {
      throw new NotFoundException('이미 존재하는 전화번호입니다.');
    }
    member.name = name;
    member.nickname = nickname;
    member.tel = tel;
    member.profileImage = profileImage;
    member.address = address;
    member.subAddress = subAddress;
    await this.membersRepository.save(member);
    return { message: '회원 정보가 수정되었습니다.' };
  }

  // 비밀번호 변경
  async changePassword(memberId: number, password: string, confirmPassword: string): Promise<IMessage> {
    const member = await this.membersRepository.findOne({ where: { id: memberId } });
    if (!member) {
      throw new NotFoundException('회원이 존재하지 않습니다.');
    }

    const oldPassword = await bcrypt.compare(password, member.password);
    if (!oldPassword) {
      throw new NotFoundException('기존 비밀번호가 올바르지 않습니다.');
    }
    const newPassword = await bcrypt.hash(confirmPassword, 10);
    member.password = newPassword;
    await this.membersRepository.save(member);
    return { message: '비밀번호가 변경되었습니다.' };
  }
  // 회원탈퇴
  async deleteMember(memberId: number): Promise<IMessage> {
    const existingMember = await this.membersRepository.findOne({ where: { id: memberId } });
    if (!existingMember) {
      throw new NotFoundException('회원이 존재하지 않습니다.');
    }

    await this.membersRepository.softDelete(memberId);
    return { message: '회원 탈퇴가 완료되었습니다.' };
  }
}
