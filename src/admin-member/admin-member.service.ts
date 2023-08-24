import { HttpException, NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddMemberDto } from 'src/_common/dtos/add-member.dto';
import { Repository } from 'typeorm';
import { Member } from '../_common/entities';
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
  async createMember(createMember: AddMemberDto): Promise<IMessage> {
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
      subAddress: createMember.subAddress,
      isAdmin: isAdmin,
    });
    return { message: '회원을 추가하였습니다.' };
  }

  async updateAdminMember(
    memberId: number,
    name: string,
    nickname: string,
    password: string,
    tel: string,
    address: string,
    subAddress: string,
    isAdmin: boolean,
    id: number,
  ): Promise<IMessage> {
    const member = await this.membersRepository.findOne({ where: { id: memberId } });
    if (!member) {
      throw new NotFoundException('회원이 존재하지 않습니다.');
    }
    const existingNickname = await this.membersRepository.findOne({ where: { nickname } });
    if (existingNickname && existingNickname.id != memberId) {
      throw new NotFoundException('이미 존재하는 닉네임입니다.');
    }
    const existingTel = await this.membersRepository.findOne({ where: { tel } });
    if (existingTel && existingTel.id != memberId) {
      throw new NotFoundException('이미 존재하는 번호입니다.');
    }
    console.log(isAdmin);
    if (id !== 1 && isAdmin) throw new HttpException('관리자 권한은 최고 관리자 권한을 부여받은 계정만 부여가 가능합니다.', 401);
    member.name = name;
    member.nickname = nickname;
    member.tel = tel;
    member.address = address;
    member.subAddress = subAddress;
    member.isAdmin = isAdmin;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      member.password = hashedPassword;
    } else {
      member.password = member.password;
    }
    await this.membersRepository.save(member);
    return { message: '회원 정보가 수정되었습니다.' };
  }

  // 회원 삭제
  async deleteMember(id: number): Promise<IMessage> {
    const existingMember = await this.membersRepository.findOne({
      where: { id },
    });

    if (!existingMember) {
      throw new NotFoundException('id와 일치하는 회원이 없습니다.');
    }
    await this.membersRepository.softDelete(id);
    return { message: '회원 삭제를 완료했습니다.' };
  }
}
