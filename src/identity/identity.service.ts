import { HttpException, Inject, Injectable } from '@nestjs/common';
import { smsSend } from '../_common/utils/sms.send';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { IdentityVerifyDto } from '../_common/dtos/identityVerify.dto';
import { IMessage } from '../_common/interfaces/message.interface';
import { identityVerifyTypes } from '../_common/utils/sms.type';
import { IClientVerifyIdentity } from '../_common/interfaces/clientVerifyIdentity.interface';
import { VerificationRequestDto } from '../_common/dtos/identityVerificationRequest.dto';
import { ISequence } from '../_common/interfaces/sequence.interface';

@Injectable()
export class IdentityService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async sendAuthentication(verifyData: VerificationRequestDto): Promise<ISequence> {
    if (identityVerifyTypes.indexOf(verifyData.type) == -1) throw new HttpException('잘못된 요청입니다.', 403);
    const authCode = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

    const sequenceCode = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

    await this.cacheManager.set(verifyData.phone, { code: authCode, type: verifyData.type, sequence: sequenceCode, verify: false }, { ttl: 300 });
    return { message: await smsSend(verifyData.phone, `[나중애] 요청하신 인증번호는 ${authCode}입니다.\n5분 내 인증을 완료해 주세요.`), sequence: sequenceCode };
  }

  async verifyAuthentication(verifyData: IdentityVerifyDto): Promise<ISequence> {
    const findByVerifyData: IClientVerifyIdentity = await this.cacheManager.get(verifyData.phone);
    if (!findByVerifyData) throw new HttpException('인증 시간이 만료되었거나, 잘못된 요청입니다.', 403);

    console.log(verifyData.sequence, findByVerifyData.sequence);

    if (verifyData.sequence !== +findByVerifyData.sequence) {
      await this.cacheManager.del(verifyData.phone);
      throw new HttpException('잘못된 요청입니다.', 403);
    }

    if (findByVerifyData.code !== verifyData.code) throw new HttpException('인증번호가 일치하지 않습니다.', 403);

    const sequenceCode = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
    await this.cacheManager.set(verifyData.phone, { ...findByVerifyData, sequence: sequenceCode, verify: true }, { ttl: 600 });

    return { message: '인증이 완료되었습니다.', sequence: sequenceCode };
  }
}
