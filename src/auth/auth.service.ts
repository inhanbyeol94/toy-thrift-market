import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../_common/entities/member.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, passowrd: string): Promise<{ access_token: string }> {
    const member = await this.memberRepository.findOne({ where: { email } });
    if (!member) {
      throw new HttpException('사용자 정보가 일치하지 않습니다.', 403);
    }
    if (!(await bcrypt.compare(passowrd, member.password))) {
      throw new HttpException('사용자 정보가 일치하지 않습니다.', 403);
    }
    const payload = { id: member.id, email: member.email, nickname: member.nickname, name: member.name, isAdmin: member.isAdmin, profileImage: member.profileImage };
    return { access_token: this.jwtService.sign(payload, { expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME, secret: process.env.ACCESS_SECRET_KEY }) };
  }

  async findByEmailOrSave(email: string, fullName: string, photo: string, provider: string): Promise<Member> {
    try {
      const foundMember = await this.memberRepository.findOne({ where: { email } });
      if (foundMember) return foundMember;

      const newMember = this.memberRepository.save({
        email,
        name: fullName,
        nickname: fullName,
        profileImage: photo,
        provider,
      });
      return newMember;
    } catch (error) {
      throw new Error('사용자를 찾거나 생성하는데 실패하였습니다');
    }
  }

  async googleLogin(req): Promise<any> {
    const { email, firstName, lastName, photo, provider } = req.user;

    const fullName = firstName + lastName;
    const member: Member = await this.findByEmailOrSave(email, fullName, photo, provider); // 이메일로 가입된 회원을 찾고, 없다면 회원가입

    // JWT 토큰에 포함될 payload
    const payload = {
      id: member.id,
      email: member.email,
      nickname: member.nickname,
      name: member.name,
      isAdmin: member.isAdmin,
      profileImage: member.profileImage,
    };

    // const accessToken = await this.jwtService.signAsync(payload);

    return { access_token: this.jwtService.sign(payload, { expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME, secret: process.env.ACCESS_SECRET_KEY }) };
  }
}
