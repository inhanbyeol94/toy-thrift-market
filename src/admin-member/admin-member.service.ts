import { HttpException, NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../_common/entities';
import { CreateMemberDto } from '../_common/dtos/members.dto';
import { IMessage } from '../_common/interfaces/message.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminMemberService {
  constructor(@InjectRepository(Member) private membersRepository: Repository<Member>) {}
  // 회원(Member) 조회
  async findMember(): Promise<Member[]> {
    return await this.membersRepository.find();
  }
  // 회원(Member) 추가
  async createMember(createMember: CreateMemberDto): Promise<IMessage> {
    const { email, nickname, tel } = createMember;

    // 이미 등록된 email 이 있는지 검증
    const existingEmail = await this.membersRepository.findOne({ where: { email } });
    if (existingEmail) throw new HttpException('이미 등록되어있는 이메일입니다.', 403);
    // 이미 등록된 Nickname 이 있는지 검증
    const existingNickname = await this.membersRepository.findOne({ where: { nickname } });
    if (existingNickname) throw new HttpException('이미 등록되어있는 닉네임입니다.', 403);
    // 이미 등록된 Tel 이 있는지 검증
    const existingTel = await this.membersRepository.findOne({ where: { tel } });
    if (existingTel) throw new HttpException('이미 등록되어있는 전화번호입니다.', 403);
    // DB에 들어가는 password 해쉬화
    createMember.password = await bcrypt.hash(createMember.password, 10);

    const isAdmin = Boolean(createMember.isAdmin);

    await this.membersRepository.save({
      email: createMember.email,
      name: createMember.name,
      nickname: createMember.nickname,
      password: createMember.password,
      tel: createMember.tel,
      address: createMember.address,
      isAdmin: isAdmin,
    });
    return { message: '회원을 추가하였습니다.' };
  }

  // async updateMember(){}

  // async deleteMember(){}
}
