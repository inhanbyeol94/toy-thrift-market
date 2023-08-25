import { SearchProductDto } from './../_common/dtos/search-product.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/_common/dtos/create-product.dto';
import { UpdateProductDto } from 'src/_common/dtos/update-product.dto';
import { Pick, Product } from 'src/_common/entities';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { ProductImageService } from 'src/product-image/product-image.service';
import { Like, Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Pick) private readonly pickRepository: Repository<Pick>,
    private productImageService: ProductImageService,
  ) {}

  // 상품 추가
  async create(_product: CreateProductDto, files: any, memberId: number): Promise<{ id: number }> {
    const { smallCategoryId, name, price, content } = _product;
    const productImages = files ? files.map((file) => file.location) : null;
    const count = 1;
    const newProduct = this.productRepository.create({
      member: { id: memberId },
      smallCategory: { id: smallCategoryId },
      name,
      price,
      content,
      count,
    });
    const product = await this.productRepository.save(newProduct);
    // 이미지 추가
    if (productImages) {
      this.productImageService.create(product.id, productImages);
    }
    return { id: product.id };
  }

  // 상품 전체 조회
  async findAll(): Promise<Product[]> {
    const products = await this.productRepository.find();
    if (!products) throw new NotFoundException('상품이 존재하지 않습니다.');
    return products;
  }

  // 내 상품 조회
  async findByMemberId(memberId: number) {
    const products = await this.productRepository.findBy({ member_id: memberId });
    return products;
  }

  // 상품 검색
  async search(search: SearchProductDto): Promise<Product[]> {
    const { searchString } = search;
    const products = await this.productRepository.find({ where: { name: Like(`%${searchString}%`) } });
    return products;
  }

  // 찜한 상품 조회
  async findPickedProducts(memberId: number) {
    const result = await this.pickRepository.find({
      where: { member_id: memberId },
      relations: { product: true },
      select: { member_id: true },
      order: { createdAt: 'DESC' },
    });
    if (!result.length) throw new NotFoundException('상품이 존재하지 않습니다.');
    const pickedProducts = result.map((item) => {
      return item.product;
    });
    return pickedProducts;
  }

  // 상품 조회
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('상품이 존재하지 않습니다.');
    return product;
  }

  // 상품 수정
  async update(id: number, updateProductDto: UpdateProductDto): Promise<IMessage> {
    const { name, price, content } = updateProductDto;
    const existingProduct = await this.findOne(id);
    if (!existingProduct) throw new NotFoundException('상품이 존재하지 않습니다.');

    const updatedProduct = { ...existingProduct, name, price, content };
    await this.productRepository.save(updatedProduct);
    return { message: '상품이 수정되었습니다.' };
  }

  // 상품 삭제
  async remove(id: number): Promise<IMessage> {
    const existingProduct = await this.findOne(id);
    if (!existingProduct) throw new NotFoundException('상품이 존재하지 않습니다.');

    await this.productRepository.delete(id);
    return { message: '상품이 삭제되었습니다.' };
  }
}
