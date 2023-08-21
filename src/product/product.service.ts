import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/_common/dtos/create-product.dto';
import { UpdateProductDto } from 'src/_common/dtos/update-product.dto';
import { Product } from 'src/_common/entities';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private productRepository: Repository<Product>) {}

  // 상품 추가
  async create(createProductDto: CreateProductDto): Promise<IMessage> {
    const { memberId, smallCategoryId, name, productStatus, price, content, count } = createProductDto;
    const newProduct = this.productRepository.create({
      member: { id: memberId },
      smallCategory: { id: smallCategoryId },
      name,
      productStatus,
      price,
      content,
      count,
    });
    await this.productRepository.save(newProduct);
    return { message: '상품이 추가되었습니다.' };
  }

  // 상품 전체 조회
  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    // return this.productRepository.findOne(updateProductDto);
    // return this.productRepository.findOne({ where: updateProductDto });
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
