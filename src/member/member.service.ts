import { HttpException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from '../_common/dtos/members.dto';
import { Repository } from 'typeorm';
import { Member } from '../_common/entities/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IResult } from '../_common/interfaces/return.interface';

@Injectable()
export class MemberService {
  constructor(@InjectRepository(Member) private membersRepository: Repository<Member>) {}
  //회원가입
  async createMember(createMemberDto: CreateMemberDto): Promise<IResult> {
    const { email } = createMemberDto;
    const existingUser = await this.membersRepository.findOne({ where: { email } });

    if (existingUser) throw new HttpException('이미 존재하는 이메일 입니다.', 403);

    const newMember = this.membersRepository.create(createMemberDto);
    await this.membersRepository.save(newMember);
    return { result: true, message: '회원가입이 완료되었습니다.' };
  }
}
