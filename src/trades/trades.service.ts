import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member, Product, Trade } from 'src/_common/entities';
import { Repository } from 'typeorm';

@Injectable()
export class TradesService {
  constructor(
    @InjectRepository(Trade) private tradeRepository: Repository<Trade>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {}

  // 상품 거래 완료
  async update(productId: number, status: number, id: number) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    const trade = await this.tradeRepository.findOne({ where: { product: { id: product.id }, member: { id: id } } });
    if (!trade) throw new NotFoundException('해당하는 구매내역이 없습니다.');
    if (trade.status === 2) throw new HttpException('이미 구매확정된 상품입니다', 404);
    trade.status = status;
    await this.tradeRepository.save(trade);
    return { message: '구매 완료 처리 되었습니다' };
  }

  // 상품 거래 생성
  async create(productId: number, id: number, accountNumber: string) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    const member = await this.memberRepository.findOne({ where: { id: id } });
    const newTrade = this.tradeRepository.create({ product: { id: product.id }, member: { id: member.id }, status: 1, buyerAccountNumber: accountNumber });
    await this.tradeRepository.save(newTrade);
    return { result: true };
  }

  // 거래 목록 조회(관리자)
  async tradeget(): Promise<Trade[]> {
    return await this.tradeRepository
      .createQueryBuilder('trade')
      .leftJoinAndSelect('trade.product', 'product')
      .leftJoinAndSelect('trade.member', 'member')
      .orderBy('trade.createdAt', 'DESC')
      .getMany();
  }

  // 상품거래 취소(관리자)
  async tradeCancle(tradeId: number) {
    const trade = await this.tradeRepository.findOne({ where: { id: tradeId } });
    if (trade.status === 2) throw new HttpException('완료된 거래는 취소불가', 404);
    trade.status = 3;
    await this.tradeRepository.save(trade);
    return { message: '거래 취소 처리 완료' };
  }
}
