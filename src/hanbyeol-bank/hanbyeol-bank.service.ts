import { Inject, Injectable } from '@nestjs/common';
import { RequestIdentityVerificationDto, VerifyAccountNumberDto, VerifyIdentityDto } from 'src/_common/dtos/verify-account-number.dto';
import * as querystring from 'querystring';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { IMessage } from 'src/_common/interfaces/message.interface';
const HANBYEOL_BANK_URL = 'http://121.170.132.3:3005';
const TYPE_ACCOUNT_VERIFICATION = 105;

@Injectable()
export class HanbyeolBankService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  //  본인 확인(요청)
  async requestIdentityVerification(data: RequestIdentityVerificationDto) {
    const { phoneNumber, accountHolder, residentRegistrationNumber } = data;
    const bodyData = {
      name: accountHolder,
      phone: phoneNumber,
      residentRegistrationNumber,
      type: TYPE_ACCOUNT_VERIFICATION,
    };

    // bodyData를 Form Encoded 문자열로 변환
    const formBody = querystring.stringify(bodyData);

    // Fetch 요청
    const response = await fetch(`${HANBYEOL_BANK_URL}/identity`, {
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

    const response = await fetch(`${HANBYEOL_BANK_URL}/identity/verify`, {
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

    const response = await fetch(`${HANBYEOL_BANK_URL}/account/verify`, {
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
