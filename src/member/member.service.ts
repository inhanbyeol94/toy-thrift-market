import { HttpException, Injectable } from '@nestjs/common';
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
}
