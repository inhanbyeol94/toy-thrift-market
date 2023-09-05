import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from 'src/_common/dtos/update-product.dto';
import { Product } from 'src/_common/entities';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { ProductImageService } from 'src/product-image/product-image.service';
import { Repository } from 'typeorm';

@Injectable()
export class AdminProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private productImageService: ProductImageService,
  ) {}

  // 상품 수정
  async update(productId: number, data: UpdateProductDto, files: any): Promise<IMessage> {
    const { name, price, content, smallCategoryId: small_category_id, newFirstImageId } = data;

    // 현재 대표 이미지 조회
    const currentFirstImage = await this.productImageService.findFIrstImage(productId);
    const currentFirstPosition = currentFirstImage.position;

    const productImages = files ? files.map((file) => file.location) : null;

    const existingProduct = await this.findOne(productId);
    const updatedProduct = { ...existingProduct, name, price, content, small_category_id };
    await this.productRepository.save(updatedProduct);

    let newImage;
    if (productImages) {
      newImage = await this.productImageService.create(existingProduct.id, productImages);
    }
    if (newFirstImageId === 0) {
      const _newFistImageId = newImage.id;
      await this.productImageService.updateFirstImage(_newFistImageId, currentFirstPosition);
    } else if (newFirstImageId !== currentFirstImage.id) {
      await this.productImageService.updateFirstImage(newFirstImageId, currentFirstPosition);
    }
    return { message: '상품이 수정되었습니다.' };
  }

  // 상품 삭제
  async remove(productId: number): Promise<IMessage> {
    const existingProduct = await this.findOne(productId);

    await this.productRepository.delete(existingProduct.id);
    return { message: '상품이 삭제되었습니다.' };
  }

  // 상품 상세 조회
  async findOne(productId: number): Promise<Product> {
    const product = await this.productRepository.createQueryBuilder('product').where('product.id = :productId', { productId }).getOne();
    if (!product) throw new NotFoundException('상품이 존재하지 않습니다.');
    return product;
  }
}
