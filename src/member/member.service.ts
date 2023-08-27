import { BadRequestException, HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IClientVerifyIdentity } from 'src/_common/interfaces/clientVerifyIdentity.interface';
import { CreateMemberDto } from '../_common/dtos/members.dto';
import { Repository } from 'typeorm';
import { Member } from '../_common/entities/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IMessage } from '../_common/interfaces/message.interface';
import * as bcrypt from 'bcrypt';
import * as AWS from 'aws-sdk';
import { UploadService } from '../upload/upload.service';
import { DeleteDto } from '../_common/dtos/delete.dto';
import { JwtService } from '@nestjs/jwt';
import { IToken } from '../_common/interfaces/token.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member) private membersRepository: Repository<Member>,
    private uploadService: UploadService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  //회원가입
  async createMember(createMember: CreateMemberDto): Promise<IMessage> {
    const findByVerifyData: IClientVerifyIdentity = await this.cacheManager.get(createMember.tel);
    if (!findByVerifyData || findByVerifyData.verify !== true || findByVerifyData.type !== 200) throw new HttpException('핸드폰 인증이 완료되지 않았습니다.', 403);

    const { email, nickname, tel } = createMember;
    // 존재하는 이메일이 있을때
    const existingEmail = await this.membersRepository.findOne({ where: { email } });
    if (existingEmail) throw new HttpException('이미 존재하는 이메일 입니다.', 403);
    // 존재하는 닉네임이 있을때
    const existingNickname = await this.membersRepository.findOne({ where: { nickname } });
    if (existingNickname) throw new HttpException('이미 존재하는 닉네임 입니다.', 403);
    // 존재하는 전화번호가 있을때
    const existingTel = await this.membersRepository.findOne({ where: { tel } });
    if (existingTel) throw new HttpException('이미 사용중인 휴대폰 번호 입니다.', 403);
    // 암호 복호화
    createMember.password = await bcrypt.hash(createMember.password, 10);
    const newMember = this.membersRepository.create(createMember);
    await this.membersRepository.save(newMember);
    await this.cacheManager.del(createMember.tel);
    return { message: '회원가입이 완료되었습니다.' };
  }
  // 회원정보 조회
  async findUser(id: number): Promise<Member> {
    const getMember = await this.membersRepository.findOne({ where: { id } });
    return {
      ...getMember,
      profileImage: getMember.profileImage || 'https://www.cmcaindia.org/wp-content/uploads/2015/11/default-profile-picture-gmail-2.png',
    };
  }
  // 회원정보 수정
  async updateMember(id: number, name: string, nickname: string, tel: string, file: Express.Multer.File, address: string, subAddress: string): Promise<IToken> {
    const member = await this.membersRepository.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException('회원이 존재하지 않습니다.');
    }
    if (nickname !== member.nickname) {
      const existingNickname = await this.membersRepository.findOne({ where: { nickname } });
      if (existingNickname) {
        throw new NotFoundException('이미 존재하는 닉네임입니다.');
      }
    }
    if (tel !== member.tel) {
      const existingTel = await this.membersRepository.findOne({ where: { tel } });
      if (existingTel) {
        throw new NotFoundException('이미 존재하는 전화번호입니다.');
      }
    }
    if (file) {
      const imageUpload = await this.uploadService.uploadFile(file);
      member.name = name;
      member.nickname = nickname;
      member.tel = tel;
      member.address = address;
      member.subAddress = subAddress;
      member.profileImage = imageUpload.Location;

      const upData = await this.membersRepository.save(member);
      const payload = { id: upData.id, email: upData.email, nickname: upData.nickname, name: upData.name, isAdmin: upData.isAdmin, profileImage: upData.profileImage };
      return {
        access_token: this.jwtService.sign(payload, { expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME, secret: process.env.ACCESS_SECRET_KEY }),
        message: '회원 정보가 수정되었습니다.',
      };
    }

    member.name = name;
    member.nickname = nickname;
    member.tel = tel;
    member.address = address;
    member.subAddress = subAddress;
    const upData = await this.membersRepository.save(member);
    const payload = { id: upData.id, email: upData.email, nickname: upData.nickname, name: upData.name, isAdmin: upData.isAdmin, profileImage: upData.profileImage };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME, secret: process.env.ACCESS_SECRET_KEY }),
      message: '회원 정보가 수정되었습니다.',
    };
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
    const editPassword = await bcrypt.hash(confirmPassword, 10);
    member.password = editPassword;
    await this.membersRepository.save(member);
    return { message: '비밀번호가 변경되었습니다.' };
  }
  // 회원탈퇴
  async deleteMember(memberId: number, Dpassword: DeleteDto): Promise<IMessage> {
    const { password } = Dpassword;
    const existingMember = await this.membersRepository.findOne({ where: { id: memberId } });
    if (!existingMember) {
      throw new NotFoundException('회원이 존재하지 않습니다.');
    }
    // 비밀번호 검증
    const isValidPassword = await bcrypt.compare(password, existingMember.password);
    if (!isValidPassword) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    await this.membersRepository.softDelete(memberId);
    return { message: '회원 탈퇴가 완료되었습니다.' };
  }
}
