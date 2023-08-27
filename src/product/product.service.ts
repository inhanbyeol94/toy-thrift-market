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
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productImages', 'productImage')
      .orderBy('productImage.position', 'ASC')
      .getMany();
    if (!products) throw new NotFoundException('상품이 존재하지 않습니다.');
    return products;
  }

  // 내 상품 조회
  async findByMemberId(memberId: number): Promise<Product[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productImages', 'productImage')
      .where('product.member_id = :memberId', { memberId })
      .orderBy('productImage.position', 'ASC')
      .getMany();
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
    const result = await this.pickRepository
      .createQueryBuilder('pick')
      .innerJoinAndSelect('pick.product', 'product')
      .leftJoinAndSelect('product.productImages', 'productImages', undefined, { order: { position: 'ASC' } })
      .where('pick.member_id = :memberId', { memberId })
      .orderBy('pick.createdAt', 'DESC')
      .getMany();
    if (!result.length) throw new NotFoundException('상품이 존재하지 않습니다.');
    const pickedProducts = result.map((item) => {
      return item.product;
    });
    return pickedProducts;
  }

  // 상품 상세 조회
  async findOne(id: number): Promise<Product> {
    // const product = await this.productRepository.findOne({ relations: { productImages: true }, where: { id } });
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productImages', 'productImage')
      .where('product.id = :id', { id })
      .orderBy('productImage.position', 'ASC')
      .getOne();
    if (!product) throw new NotFoundException('상품이 존재하지 않습니다.');
    return product;
  }

  // 상품 수정
  async update(id: number, updateProductDto: UpdateProductDto, files: any): Promise<IMessage> {
    const { name, price, content, smallCategoryId: small_category_id } = updateProductDto;
    const productImages = files ? files.map((file) => file.location) : null;

    const existingProduct = await this.findOne(id);
    if (!existingProduct) throw new NotFoundException('상품이 존재하지 않습니다.');
    const updatedProduct = { ...existingProduct, name, price, content, small_category_id };
    await this.productRepository.save(updatedProduct);
    if (productImages) {
      this.productImageService.create(existingProduct.id, productImages);
    }
    return { message: '상품이 수정되었습니다.' };
  }

  // 상품 삭제
  async remove(id: number): Promise<IMessage> {
    const existingProduct = await this.findOne(id);
    if (!existingProduct) throw new NotFoundException('상품이 존재하지 않습니다.');

    await this.productRepository.delete(id);
    return { message: '상품이 삭제되었습니다.' };
  }

  // 인기상품 조회
  async findPopularProducts() {
    const popularProducts = await this.productRepository
      .createQueryBuilder('Product')
      .leftJoinAndSelect('Product.picks', 'Pick')
      .leftJoinAndSelect('Pick.member', 'PickMember')
      .leftJoinAndSelect('Product.productImages', 'ProductImage')
      .select(['Product', 'COUNT(Pick.id) as pickCount', 'ProductImage'])
      .groupBy('Product.id')
      .orderBy('PickCount', 'DESC')
      .limit(6)
      .getRawMany();

    return popularProducts;
  }

  // 카테고리 별 상품 조회
  async getRecentProductsByCategory(categoryId: number) {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.smallCategory', 'smallCategory')
      .leftJoinAndSelect('smallCategory.middleCategory', 'middleCategory')
      .leftJoinAndSelect('product.productImages', 'productImage')
      .where('middleCategory.largeCategory.id = :categoryId', { categoryId })
      .orderBy('product.createdAt', 'DESC')
      .limit(20)
      .getMany();

    return products;
  }

  // 최신 상품 전체 조회
  async findAllRecent(): Promise<Product[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productImages', 'productImage')
      .orderBy('product.createdAt', 'DESC')
      .limit(20)
      .getMany();
    if (!products) throw new NotFoundException('상품이 존재하지 않습니다.');
    return products;
  }
}
