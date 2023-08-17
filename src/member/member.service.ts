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
    const { email } = createMember;
    const existingUser = await this.membersRepository.findOne({ where: { email } });

    if (existingUser) throw new HttpException('이미 존재하는 이메일 입니다.', 403);
    // 암호 복호화
    createMember.password = await bcrypt.hash(createMember.password, 10);
    const newMember = this.membersRepository.create(createMember);
    await this.membersRepository.save(newMember);
    return { message: '회원가입이 완료되었습니다.' };
  }
}
