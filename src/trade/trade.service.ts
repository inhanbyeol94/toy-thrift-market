import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, Trade } from 'src/_common/entities';
import { Repository } from 'typeorm';

@Injectable()
export class TradeService {
  constructor(
    @InjectRepository(Trade) private tradeRepository: Repository<Trade>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  // 상품 상태 조회
  async getsatus(productId: number) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    const existingTrade = await this.tradeRepository.findOne({ where: { product: { id: product.id } } });
    if (!existingTrade) throw new NotFoundException('해당하는 거래상품이 없습니다.');
    return existingTrade.status;
  }

  // 상품 거래 완료
  async update(productId: number, status: number) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    const existingTrade = await this.tradeRepository.findOne({ where: { product: { id: product.id } } });
    if (!existingTrade) throw new NotFoundException('해당하는 상품의 거래가 없습니다.');
    if (existingTrade.status === 2) throw new HttpException('이미 완료된 거래입니다', 404);
    existingTrade.status = status;
    await this.tradeRepository.save(existingTrade);
    return { message: '상품거래가 거래완료 처리 되었습니다' };
  }
}
