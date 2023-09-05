import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member, Pick, Product } from 'src/_common/entities';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { Repository } from 'typeorm';

@Injectable()
export class PickService {
  constructor(
    @InjectRepository(Pick) private pickRepository: Repository<Pick>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {}
  // 찜 생성 (찜 정보가 있으면 삭제, 없으면 추가)
  async createPick(id: number, productId: number): Promise<IMessage> {
    const existingMember = await this.memberRepository.findOne({ where: { id } });
    const existingProduct = await this.productRepository.findOne({ where: { id: productId } });

    const existingPick = await this.pickRepository.findOne({ where: { member: { id: existingMember.id }, product: { id: existingProduct.id } } });

    if (existingPick) {
      await this.pickRepository.delete(existingPick.id);
      return { message: '찜목록에서 삭제되었습니다.' };
    } else {
      const newPick = this.pickRepository.create({ member: { id: existingMember.id }, product: { id: existingProduct.id } });
      await this.pickRepository.save(newPick);
      return { message: '찜목록에 추가되었습니다.' };
    }
  }
  //찜 한 목록 불러오기
  async getMyPicks(id: number, categoryId: number){
    const picks = await this.pickRepository
        .createQueryBuilder('pick')
        .innerJoinAndSelect('pick.product', 'product')
        .leftJoinAndSelect('product.smallCategory', 'smallCategory')
        .leftJoinAndSelect('smallCategory.middleCategory', 'middleCategory')
        .leftJoinAndSelect('product.productImages', 'productImage')
        .where('middleCategory.largeCategory.id = :categoryId', { categoryId })
        .andWhere('pick.member_id = :memberId', { memberId:id })
        .orderBy({
          'product.createdAt': 'DESC',
          'productImage.position': 'ASC',
        })
        .limit(20)
        .getMany()
    return picks;
  }
}
