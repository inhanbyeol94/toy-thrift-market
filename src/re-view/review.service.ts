import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReViewDto, UpdateReViewDto } from '../_common/dtos/review.dto';
import { Member, Product, Review, Trade } from 'src/_common/entities';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReViewService {
  constructor(
    @InjectRepository(Trade) private tradeRepository: Repository<Trade>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
  ) {}

  //리뷰 생성
  async addReview(productId: number, id: number, createData: CreateReViewDto): Promise<IMessage> {
    const { content } = createData;
    const product = await this.productRepository.findOne({ where: { id: productId } });
    const member = await this.memberRepository.findOne({ where: { id: id } });
    const trade = await this.tradeRepository.findOne({ where: { product: { id: product.id }, member: { id: member.id } } });
    if (!trade) throw new NotFoundException('해당하는 거래가 없습니다.');
    const newReview = this.reviewRepository.create({ content, trade: { id: trade.id } });
    await this.reviewRepository.save(newReview);
    return { message: '리뷰가 작성되었습니다.' };
  }
  // 리뷰 수정
  async editReview(reviewId: number, id: number, updateData: UpdateReViewDto): Promise<IMessage> {
    const { content } = updateData;
    const review = await this.reviewRepository.findOne({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('해당하는 리뷰가 없습니다.');
    review.content = content;
    await this.reviewRepository.save(review);
    return { message: '리뷰가 수정되었습니다.' };
  }
  // 리뷰 조회
  async getReview(reviewId: number, id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('해당하는 리뷰가 없습니다.');
    return review;
  }
  // 리뷰 삭제
  async deleteReview(reviewId: number, id: number): Promise<IMessage> {
    const review = await this.reviewRepository.findOne({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('해당하는 리뷰가 없습니다.');
    await this.reviewRepository.delete(reviewId);
    return { message: '리뷰가 삭제되었습니다.' };
  }
}
