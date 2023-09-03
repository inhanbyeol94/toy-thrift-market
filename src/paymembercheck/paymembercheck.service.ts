import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { PayAccountCheckDto, PayverifyDto, PaymemberCheckDto, transferDto } from 'src/_common/dtos/paymentcheck.dto';
import { Member, Product } from 'src/_common/entities';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { IClientVerifyIdentity } from 'src/_common/interfaces/clientVerifyIdentity.interface';

@Injectable()
export class PaymembercheckService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async checkandPostBankServer(id: number, checkData: PaymemberCheckDto) {
    const { name, tel, resistNumber } = checkData;
    const existingMember = await this.memberRepository.findOne({ where: { id } });
    if (existingMember.name !== name) throw new HttpException('회원 이름과 일치하지 않습니다.', 404);
    if (existingMember.tel !== tel) throw new HttpException('회원 연락처와 일치하지 않습니다.', 404);

    const bankServerUrl = 'http://121.170.132.3:3005/identity';
    const bankServerPayload = {
      name: name,
      phone: tel,
      residentRegistrationNumber: resistNumber,
      type: 106,
    };
    const response = await axios.post(bankServerUrl, bankServerPayload);
    await this.cacheManager.set(checkData.tel, { code: response.data.code, sequence: response.data.sequence, verify: false }, { ttl: 300 });
    console.log(await this.cacheManager.get(checkData.tel));
    return response.data;
  }

  async verify(verifyData: PayverifyDto) {
    const { phone, code, sequence } = verifyData;
    const bankServerUrl = 'http://121.170.132.3:3005/identity/verify';
    const bankServerPayload = {
      phone,
      code,
      sequence,
    };
    const response = await axios.post(bankServerUrl, bankServerPayload);

    const findByVerifyData: IClientVerifyIdentity = await this.cacheManager.get(verifyData.phone);
    await this.cacheManager.set(verifyData.phone, { ...findByVerifyData, sequence: response.data.sequence, verify: true }, { ttl: 600 });
    console.log(await this.cacheManager.get(verifyData.phone));
    return response.data;
  }

  async accountCheck(accountCheckData: PayAccountCheckDto) {
    const { name, phone, resistNumber, accountNumber, password, sequence } = accountCheckData;
    console.log(name, phone, resistNumber, accountNumber, password, sequence);
    const bankServerUrl = 'http://121.170.132.3:3005/account/verify';
    const bankServerPayload = {
      name,
      phone,
      residentRegistrationNumber: resistNumber,
      accountNumber,
      password,
      sequence,
    };
    try {
      const response = await axios.post(bankServerUrl, bankServerPayload);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async transfer(transferData: transferDto) {
    const { productId, name, phone, residentRegistrationNumber, accountNumber, password, sequence } = transferData;

    const product = await this.productRepository.findOne({ where: { id: productId } });

    const bankServerUrl = 'http://121.170.132.3:3005/trade/direct/deposit';
    const bankServerPayload = {
      name,
      phone,
      residentRegistrationNumber,
      accountNumber,
      password,
      amount: product.price,
      requestAccountNubmer: '930077-00-618401',
      requestName: '나중애',
      sequence,
    };
    const response = await axios.post(bankServerUrl, bankServerPayload);
    return response.data;
  }
}
