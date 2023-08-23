import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from 'src/_common/entities';
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

  // findAll() {
  //   return `This action returns all productImage`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} productImage`;
  // }

  // update(id: number, updateProductImageDto: UpdateProductImageDto) {
  //   return `This action updates a #${id} productImage`;
  // }

  remove(id: number) {
    return `This action removes a #${id} productImage`;
  }
}
