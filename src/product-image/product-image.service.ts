import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from 'src/_common/entities';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ProductImageService {
  constructor(@InjectRepository(ProductImage) private productImageRepository: Repository<ProductImage>) {}

  async create(productId: number, productImages: string[]) {
    await Promise.all(
      productImages.map(async (imageUrl: string) => {
        return await this.productImageRepository.insert({
          product: { id: productId },
          imageUrl,
        });
      }),
    );
  }

  async remove(id: number): Promise<IMessage> {
    await this.productImageRepository.delete(id);
    return { message: '이미지가 삭제되었습니다.' };
  }
}
