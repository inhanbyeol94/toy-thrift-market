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
    const { smallCategoryId, name, price, content, bankAccountNumber } = _product;
    const productImages = files ? files.map((file) => file.location) : null;
    const newProduct = this.productRepository.create({
      member: { id: memberId },
      smallCategory: { id: smallCategoryId },
      name,
      price,
      content,
      bankAccountNumber,
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
      .leftJoinAndSelect('product.trades', 'trades')
      .where('product.member_id = :memberId', { memberId })
      .orderBy('product.createdAt', 'DESC')
      .addOrderBy('productImage.position', 'ASC')
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
      .leftJoin('product.member', 'member')
      .addSelect(['member.nickname', 'member.profileImage'])
      .leftJoinAndSelect('product.smallCategory', 'smallCategory')
      .leftJoinAndSelect('product.trades', 'trades')
      .leftJoin('trades.review', 'review')
      .addSelect(['review.id', 'review.content', 'review.updatedAt'])
      .leftJoin('trades.member', 'reviewer')
      .addSelect(['reviewer.nickname', 'reviewer.profileImage'])
      .leftJoinAndSelect('product.productImages', 'productImage')
      .where('product.id = :id', { id })
      .orderBy('productImage.position', 'ASC')
      .getOne();
    if (!product) throw new NotFoundException('상품이 존재하지 않습니다.');
    return product;
  }

  // 상품 수정
  async update(id: number, updateProductDto: UpdateProductDto, files: any): Promise<IMessage> {
    const { name, price, content, smallCategoryId: small_category_id, newFirstImageId } = updateProductDto;

    // 현재 대표 이미지 조회
    const currentFirstImage = await this.productImageService.findFIrstImage(id);
    const currentFirstPosition = currentFirstImage.position;

    const productImages = files ? files.map((file) => file.location) : null;

    const existingProduct = await this.findOne(id);
    if (!existingProduct) throw new NotFoundException('상품이 존재하지 않습니다.');
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
  async remove(id: number): Promise<IMessage> {
    const existingProduct = await this.findOne(id);
    if (!existingProduct) throw new NotFoundException('상품이 존재하지 않습니다.');

    await this.productRepository.delete(id);
    return { message: '상품이 삭제되었습니다.' };
  }

  // 인기상품 조회
  async findPopularProducts() {
    const query = `
    SELECT 
        product.*, 
        (SELECT COUNT(*) FROM pick WHERE pick.product_id = product.id) as pickCount,
        (SELECT image_Url FROM product_image WHERE product_image.product_id = product.id ORDER BY position ASC LIMIT 1) as product_image
    FROM 
        product
    ORDER BY 
        pickCount DESC;
  `;

    const popularProducts = await this.productRepository.query(query);

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
      .orderBy({
        'product.createdAt': 'DESC',
        'productImage.position': 'ASC',
      })
      .limit(20)
      .getMany();

    return products;
  }

  // 최신 상품 전체 조회
  async findAllRecent(): Promise<Product[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productImages', 'productImage')
      .orderBy({
        'product.createdAt': 'DESC',
        'productImage.position': 'ASC',
      })
      .limit(20)
      .getMany();
    if (!products) throw new NotFoundException('상품이 존재하지 않습니다.');
    return products;
  }

  // 구매내역 조회
  async findTradedProducts(memberId: number): Promise<Product[]> {
    const query = `
    SELECT 
        p.*, 
        t.status, 
        (SELECT image_Url FROM product_image WHERE product_image.product_id = p.id ORDER BY position ASC LIMIT 1) as product_image,
        r.id as review_id
    FROM product p
    LEFT JOIN trade t ON p.id = t.product_id
    LEFT JOIN member m ON t.member_id = m.id
    LEFT JOIN review r ON t.id = r.trade_id
    WHERE m.id = ?`;
    const products = await this.productRepository.query(query, [memberId]);
    return products;
  }

  // 내 상품 카테고리별 조회
  async getMyProductsByCategory(categoryId: number, id: number) {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.smallCategory', 'smallCategory')
      .leftJoinAndSelect('smallCategory.middleCategory', 'middleCategory')
      .leftJoinAndSelect('product.productImages', 'productImage')
      .where('middleCategory.largeCategory.id = :categoryId', { categoryId })
      .andWhere('product.member.id = :id', { id })
      .orderBy({
        'product.createdAt': 'DESC',
        'productImage.position': 'ASC',
      })
      .limit(20)
      .getMany();

    return products;
  }

  // 구매내역 카테고리 별 조회
  async findTradedByCategory(categoryId: number, memberId: number): Promise<Product[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.smallCategory', 'smallCategory')
      .innerJoinAndSelect('product.trades', 'trade')
      .innerJoin('trade.member', 'member')
      .innerJoin('smallCategory.middleCategory', 'middleCategory')
      .leftJoinAndSelect('trade.review', 'review')
      .leftJoinAndSelect('product.productImages', 'productImage')
      .where('middleCategory.largeCategory.id = :categoryId', { categoryId })
      .andWhere('trade.member_id = :memberId', { memberId })
      .orderBy({
        'product.createdAt': 'DESC',
        'productImage.position': 'ASC',
      })
      .getMany();

    return products;
  }
}
