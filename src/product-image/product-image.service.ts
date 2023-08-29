import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from 'src/_common/entities';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ProductImageService {
  constructor(@InjectRepository(ProductImage) private productImageRepository: Repository<ProductImage>) {}

  async create(productId: number, productImages: string[]): Promise<ProductImage> {
    const foundedImages = await this.findAllImages(productId);
    // 기존에 존재하는 이미지가 없는 경우, 시작값을 0으로
    let lastPosition = 0;

    // 있을 경우 가장 뒷순서에서부터 1024씩 추가하여 저장
    if (foundedImages.length !== 0) lastPosition = foundedImages[0].position;

    let newFirstImage: ProductImage;
    for (let i = 0; i < productImages.length; i++) {
      const image = await this.productImageRepository.create({
        imageUrl: productImages[i],
        product: { id: productId },
        position: lastPosition + 1024 * (i + 1),
      });
      const newImage = await this.productImageRepository.save(image);
      if (i === 0) newFirstImage = newImage;
    }
    return newFirstImage;
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

  async findOne(id: number): Promise<ProductImage> {
    const image = await this.productImageRepository.findOne({ where: { id } });
    if (!image) throw new NotFoundException('이미지를 찾을 수 없습니다');
    return image;
  }

  // 현재 대표 이미지 조회
  async findFIrstImage(productId: number): Promise<ProductImage> {
    const firstImage = await this.productImageRepository
      .createQueryBuilder('productImage')
      .where('productImage.product = :productId', { productId })
      .orderBy('productImage.position', 'ASC')
      .take(1)
      .getOne();
    return firstImage;
  }

  // 입력받은 ID의 이미지로 대표이미지 수정
  async updateFirstImage(productImageId: number, currentFirstPosition: number): Promise<IMessage> {
    const newFirstImage = await this.productImageRepository.findOneBy({ id: productImageId });
    newFirstImage.position = currentFirstPosition - 1;
    await this.productImageRepository.save(newFirstImage);
    return { message: '대표이미지가 수정되었습니다.' };
  }

  async remove(id: number): Promise<IMessage> {
    await this.productImageRepository.delete(id);
    return { message: '이미지가 삭제되었습니다.' };
  }
}
