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
    const payload = { id: member.id, email: member.email, nickname: member.nickname };
    return { access_token: this.jwtService.sign(payload, { expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME, secret: process.env.ACCESS_SECRET_KEY }) };
  }
}
