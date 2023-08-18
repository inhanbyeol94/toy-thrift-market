import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SmallCategoryDto } from '../_common/dtos/categories.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IMessage } from '../_common/interfaces/message.interface';
import { LargeCategory, MiddleCategory, SmallCategory } from 'src/_common/entities';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(SmallCategory) private smallCategoryRepository: Repository<SmallCategory>,
    @InjectRepository(MiddleCategory) private middleCategoryRepository: Repository<MiddleCategory>,
    @InjectRepository(LargeCategory) private largeCategoriesRepository: Repository<LargeCategory>,
  ) {}

  async createLargeCategory(name: string): Promise<LargeCategory> {
    const largeCategory = this.largeCategoriesRepository.create({ name });
    await this.largeCategoriesRepository.save(largeCategory);
    return largeCategory;
  }

  async findAllLargeCategories(): Promise<LargeCategory[]> {
    const largeCategories = await this.largeCategoriesRepository.find({
      relations: ['middleCategories', 'middleCategories.smallCategories', 'middleCategories.smallCategories.products'],
    });
    return largeCategories;
  }

  async updateLargeCategory(id: number, name: string) {
    const existLargeCategory = await this.largeCategoriesRepository.findOne({ where: { id } });
    if (!existLargeCategory) {
      throw new NotFoundException('카테고리(대)가 존재하지 않습니다.');
    }
    existLargeCategory.name = name;
    await this.largeCategoriesRepository.save(existLargeCategory);
  }

  async deleteLargeCategory(id: number) {
    const existLargeCategory = await this.largeCategoriesRepository.findOne({ where: { id } });
    if (!existLargeCategory) {
      throw new NotFoundException('카테고리(대)가 존재하지 않습니다.');
    }
    await this.largeCategoriesRepository.delete(id);
  }

  // 카테고리(소) 생성
  async createSmallCategory(createSmallCategory: SmallCategoryDto): Promise<IMessage> {
    const { middleCategoryId, name } = createSmallCategory;

    const existingMiddleCategory = await this.middleCategoryRepository.findOne({ where: { id: middleCategoryId } });
    if (!existingMiddleCategory) {
      throw new HttpException('해당 중간 카테고리가 존재하지 않습니다.', 404);
    }

    const existingSmallCategory = await this.smallCategoryRepository.findOne({ where: { name } });
    if (existingSmallCategory) {
      throw new HttpException('이미 존재하는 카테고리명입니다.', 403);
    }

    const newSmallCategory = this.smallCategoryRepository.create({
      name,
      middleCategory: existingMiddleCategory,
    });

    await this.smallCategoryRepository.save(newSmallCategory);
    return { message: '카테고리(소)가 추가되었습니다.' };
  }

  // 카테고리(소) 조회
  async getSmallCategory(): Promise<SmallCategory[]> {
    return this.smallCategoryRepository.find();
  }

  // 카테고리(소) 개별 조회
  async getSmallCategoryById(id: number) {
    return this.smallCategoryRepository.findOne({ where: { id } });
  }

  // 카테고리(소) 수정
  async updateSmallCategory(id: number, name: string) {
    const category = await this.smallCategoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('해당하는 카테고리가 없습니다.');
    }

    category.name = name;
    await this.smallCategoryRepository.save(category);
  }

  // 카테고리(소) 삭제
  async deleteSmallCategory(id: number) {
    const category = this.smallCategoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('해당하는 카테고리가 없습니다.');
    }

    await this.smallCategoryRepository.delete(id);
    return { message: `카테고리(소)가 삭제되었습니다. ID: ${id}` };
  }
}
