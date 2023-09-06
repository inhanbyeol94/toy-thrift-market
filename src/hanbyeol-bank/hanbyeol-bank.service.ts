import { HttpException, Inject, Injectable } from '@nestjs/common';
import { RequestIdentityVerificationDto, VerifyAccountNumberDto, VerifyIdentityDto } from 'src/_common/dtos/verify-account-number.dto';
import * as querystring from 'querystring';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/_common/entities';
import { Repository } from 'typeorm';
// const HANBYEOL_BANK_HOST = process.env.BANK_HOST;
const TYPE_ACCOUNT_VERIFICATION = 105;

@Injectable()
export class HanbyeolBankService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  //  본인 확인(요청)
  async requestIdentityVerification(userId: number, data: RequestIdentityVerificationDto): Promise<IMessage> {
    const { phoneNumber, accountHolder, residentRegistrationNumber } = data;
    const existingMember = await this.memberRepository.findOne({ where: { id: userId } });
    if (existingMember.name !== accountHolder) throw new HttpException('회원 이름과 일치하지 않습니다.', 404);
    if (existingMember.tel !== phoneNumber) throw new HttpException('회원 연락처와 일치하지 않습니다.', 404);

    const bodyData = {
      name: accountHolder,
      phone: phoneNumber,
      residentRegistrationNumber,
      type: TYPE_ACCOUNT_VERIFICATION,
    };

    // bodyData를 Form Encoded 문자열로 변환
    const formBody = querystring.stringify(bodyData);

    // Fetch 요청
    const response = await fetch(`http://${process.env.BANK_HOST}/identity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    const result = await response.json();
    await this.cacheManager.set(phoneNumber, { sequence: result.sequence }, { ttl: 300 });

    return { message: '인증번호가 전송되었습니다.' };
  }

  //  본인 확인(검증)
  async verifyIdentity(data: VerifyIdentityDto) {
    const { phoneNumber, verificationCode } = data;
    const { sequence } = await this.cacheManager.get(phoneNumber);
    const bodyData = {
      phone: phoneNumber,
      code: verificationCode,
      sequence,
    };

    const formBody = querystring.stringify(bodyData);

    const response = await fetch(`http://${process.env.BANK_HOST}/identity/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    });
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    const result = await response.json();
    await this.cacheManager.set(phoneNumber, { sequence: result.sequence }, { ttl: 300 });
    return result;
  }

  // 계좌 유효성 검사
  async verifyAccountNumber(data: VerifyAccountNumberDto): Promise<IMessage> {
    const { bankAccountNumber, phoneNumber, accountHolder, residentRegistrationNumber, password } = data;
    const { sequence } = await this.cacheManager.get(phoneNumber);
    const bodyData = {
      name: accountHolder,
      phone: phoneNumber,
      residentRegistrationNumber,
      accountNumber: bankAccountNumber,
      password,
      sequence,
    };

    const formBody = querystring.stringify(bodyData);

    const response = await fetch(`http://${process.env.BANK_HOST}/account/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    });
    const result = await response.json();
    if (!response.ok) {
      console.log(result);
      return result;
    }

    return { message: '유효성 검사가 완료되었습니다' };
  }
}
