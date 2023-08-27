import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductImagePositionDto } from 'src/_common/dtos/product-image.dto';
import { ProductImage } from 'src/_common/entities';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ProductImageService {
  constructor(@InjectRepository(ProductImage) private productImageRepository: Repository<ProductImage>) {}

  async create(productId: number, productImages: string[]): Promise<IMessage> {
    const foundedImages = await this.findAllImages(productId);
    // 기존에 존재하는 이미지가 없는 경우, 시작값을 0으로
    let lastPosition = 0;
    // 있을 경우 가장 뒷순서에서부터 1024씩 추가하여 저장
    if (foundedImages.length !== 0) lastPosition = foundedImages[0].position;
    for (let i = 0; i < productImages.length; i++) {
      await this.productImageRepository.insert({
        imageUrl: productImages[i],
        product: { id: productId },
        position: lastPosition + 1024 * (i + 1),
      });
    }
    return { message: '이미지가 추가되었습니다.' };
  }

  // 상품의 모든 이미지를 순서 내림차순으로 조회
  async findAllImages(productId: number): Promise<ProductImage[]> {
    const foundedImages = await this.productImageRepository
      .createQueryBuilder('productImage')
      .where('productImage.product = :productId', { productId })
      .orderBy('productImage.position', 'DESC')
      .getMany();
    return foundedImages;
  }

  async findOne(id: number) {
    const image = await this.productImageRepository.findOne({ where: { id } });
    if (!image) throw new NotFoundException('이미지를 찾을 수 없습니다');
    return image;
  }

  // 이미지 순서를 변경
  async updatePosition(data: UpdateProductImagePositionDto) {
    const id = data.id;

    // 맨 앞으로 이동
    if (data.prev === 0) {
      const next = await this.findOne(data.next);
      const position = Math.round(next.position / 2);
      await this.productImageRepository.createQueryBuilder().update(ProductImage).set({ position }).where('id = :id', { id }).execute();
      return { message: '상품 이미지 순서가 변경되었습니다' };
    }
    // 맨 뒤로 이동
    if (data.next === 0) {
      const prev = await this.findOne(data.prev);
      const position = prev.position + 1024;
      await this.productImageRepository.createQueryBuilder().update(ProductImage).set({ position }).where('id = :id', { id }).execute();
      return { message: '상품 이미지 순서가 변경되었습니다' };
    }

    // 중간 어딘가로 이동
    const prev = await this.findOne(data.prev);
    const next = await this.findOne(data.next);
    const position = Math.round((prev.position + next.position) / 2);
    await this.productImageRepository.createQueryBuilder().update(ProductImage).set({ position }).where('id = :id', { id }).execute();
    return { message: '상품 이미지 순서가 변경되었습니다' };
  }

  async remove(id: number): Promise<IMessage> {
    await this.productImageRepository.delete(id);
    return { message: '이미지가 삭제되었습니다.' };
  }
}
