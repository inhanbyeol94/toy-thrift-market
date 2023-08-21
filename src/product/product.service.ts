import { Injectable, NotFoundException } from '@nestjs/common';
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

  // 상품 조회
  async findOne(id: number): Promise<Product> {
    return await this.productRepository.findOne({ where: { id } });
  }

  // 상품 수정
  async update(id: number, updateProductDto: UpdateProductDto): Promise<IMessage> {
    const { name, price, content, count } = updateProductDto;
    const existingMember = await this.findOne(id);
    if (!existingMember) throw new NotFoundException('회원이 존재하지 않습니다.');

    const updatedMember = { ...existingMember, name, price, content, count };
    await this.productRepository.save(updatedMember);
    return { message: '상품이 수정되었습니다.' };
  }

  async remove(id: number): Promise<IMessage> {
    const existingMember = await this.findOne(id);
    if (!existingMember) throw new NotFoundException('회원이 존재하지 않습니다.');

    await this.productRepository.delete(id);
    return { message: '상품이 삭제되었습니다.' };
  }
}
