import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { PayAccountCheckDto, PayverifyDto, PaymemberCheckDto, transferDto } from 'src/_common/dtos/paymentcheck.dto';
import { Member, Product, Trade } from 'src/_common/entities';
import { Repository } from 'typeorm';
import { TradesService } from 'src/trades/trades.service';

@Injectable()
export class PaymembercheckService {
  constructor(
    @InjectRepository(Trade) private tradeRepository: Repository<Trade>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    private tradeService: TradesService,
  ) {}

  async checkandPostBankServer(id: number, checkData: PaymemberCheckDto) {
    const { name, tel, resistNumber } = checkData;
    const existingMember = await this.memberRepository.findOne({ where: { id } });
    if (existingMember.name !== name) throw new HttpException('회원 이름과 일치하지 않습니다.', 404);
    if (existingMember.tel !== tel) throw new HttpException('회원 연락처와 일치하지 않습니다.', 404);

    const bankServerUrl = `http://${process.env.BANK_HOST}/identity`;
    const bankServerPayload = {
      name: name,
      phone: tel,
      residentRegistrationNumber: resistNumber,
      type: 106,
    };

    try {
      const response = await axios.post(bankServerUrl, bankServerPayload);
      return response.data;
    } catch (error) {
      throw new HttpException(error.response.data.message, error.response.status);
    }
  }

  async verify(verifyData: PayverifyDto) {
    const { phone, code, sequence } = verifyData;
    const bankServerUrl = `http://${process.env.BANK_HOST}/identity/verify`;
    const bankServerPayload = {
      phone,
      code,
      sequence,
    };
    try {
      const response = await axios.post(bankServerUrl, bankServerPayload);
      return response.data;
    } catch (error) {
      console.log(error.response.data.message);
      throw new HttpException(error.response.data.message, error.response.status);
    }
  }

  async transfer(transferData: transferDto, id: number) {
    const { productId, name, phone, residentRegistrationNumber, accountNumber, password, sequence } = transferData;

    const product = await this.productRepository.findOne({ where: { id: productId } });

    const bankServerUrl = `http://${process.env.BANK_HOST}/trade/direct/deposit`;
    const bankServerPayload = {
      name,
      phone,
      residentRegistrationNumber,
      accountNumber,
      password,
      amount: product.price,
      requestAccountNubmer: `${process.env.NAJUNGE_ACCOUNT}`,
      // requestName: `${process.env.NAJUNGE_ACCOUNT_NAME}`,
      sequence,
    };

    try {
      const response = await axios.post(bankServerUrl, bankServerPayload);

      const createTrade = await this.tradeService.create(productId, id, accountNumber);
      if (createTrade.result == true) return { message: '결제가 완료되었습니다.' };
      return { message: '오류가 발생하였습니다.' };
    } catch (error) {
      throw new HttpException(error.response.data.message, error.response.status);
    }
  }

  async endTransfer(productId: number, status: number, id: number) {
    await this.tradeService.update(productId, status, id);

    const bankServerUrl = `http://${process.env.BANK_HOST}/trade/direct/deposit`;
    const product = await this.productRepository.findOne({ where: { id: productId } });
    const bankServerPayload = {
      name: `${process.env.NAJUNGE_ACCOUNT_NAME}`,
      phone: `${process.env.NAJUNGE_PHONE}`,
      residentRegistrationNumber: `${process.env.NAJUNGE_REGISTRATIONNUM}`,
      accountNumber: `${process.env.NAJUNGE_ACCOUNT}`,
      password: `${process.env.NAJUNGE_PASSWORD}`,
      amount: product.price,
      requestAccountNubmer: product.bankAccountNumber,
      // requestName: product.member.name,
      sequence: '101010',
      partnerKey: `${process.env.NAJUNGE_SECRETKEY}`,
    };

    try {
      const response = await axios.post(bankServerUrl, bankServerPayload);
      return true;
    } catch (error) {
      throw new HttpException(error.response.data.message, error.response.status);
    }
  }

  async cancleTransfer(tradeId: number) {
    await this.tradeService.tradeCancle(tradeId);

    const bankServerUrl = `http://${process.env.BANK_HOST}/trade/direct/deposit`;
    const trade = await this.tradeRepository.findOne({ where: { id: tradeId }, relations: ['product'] });
    const bankServerPayload = {
      name: `${process.env.NAJUNGE_ACCOUNT_NAME}`,
      phone: `${process.env.NAJUNGE_PHONE}`,
      residentRegistrationNumber: `${process.env.NAJUNGE_REGISTRATIONNUM}`,
      accountNumber: `${process.env.NAJUNGE_ACCOUNT}`,
      password: `${process.env.NAJUNGE_PASSWORD}`,
      amount: trade.product.price,
      requestAccountNubmer: trade.buyerAccountNumber,
      // requestName: trade.member.name,
      sequence: '101010',
      partnerKey: `${process.env.NAJUNGE_SECRETKEY}`,
    };
    try {
      const response = await axios.post(bankServerUrl, bankServerPayload);
      return response.data;
    } catch (error) {
      throw new HttpException(error.response.data.message, error.response.status);
    }
  }
}
