import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateMiddleCategoryDto } from '../_common/dtos/middlecategory.dto';
import { SmallCategoryDto, UpdateCategoryDto } from '../_common/dtos/categories.dto';
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
  // 카테고리(대) 추가
  async createLargeCategory(name: string): Promise<LargeCategory> {
    const largeCategory = this.largeCategoriesRepository.create({ name });
    await this.largeCategoriesRepository.save(largeCategory);
    return largeCategory;
  }
  // 모든 카테고리(대) 조회
  async findAllLargeCategories(): Promise<LargeCategory[]> {
    const largeCategories = await this.largeCategoriesRepository.find({
      relations: ['middleCategories', 'middleCategories.smallCategories'],
    });
    return largeCategories;
  }
  // 카테고리(대) 수정
  async updateLargeCategory(id: number, name: string): Promise<IMessage> {
    const existLargeCategory = await this.largeCategoriesRepository.findOne({ where: { id } });
    if (!existLargeCategory) {
      throw new NotFoundException('카테고리(대)가 존재하지 않습니다.');
    }
    existLargeCategory.name = name;
    await this.largeCategoriesRepository.save(existLargeCategory);
    return { message: '카테고리(대)가 수정되었습니다.' };
  }
  // 카테고리(대) 삭제
  async deleteLargeCategory(id: number): Promise<IMessage> {
    const existLargeCategory = await this.largeCategoriesRepository.findOne({ where: { id } });
    if (!existLargeCategory) {
      throw new NotFoundException('카테고리(대)가 존재하지 않습니다.');
    }
    await this.largeCategoriesRepository.delete(id);
    return { message: '카테고리(대)가 삭제되었습니다.' };
  }

  // 카테고리(중) 등록
  async createMiddleCategory(createMiddleCategory: CreateMiddleCategoryDto): Promise<IMessage> {
    // 등록된 카테고리 확인
    const { name } = createMiddleCategory;
    const existingLargeCategory = await this.largeCategoriesRepository.findOne({ where: { id: createMiddleCategory.largeCategoryId } });
    if (!existingLargeCategory) throw new HttpException('존재하지 않는 카테고리입니다.', 404);
    const existingMiddleCategory = await this.middleCategoryRepository.findOne({ where: { name } });
    if (existingMiddleCategory) throw new HttpException('이미 등록된 카테고리입니다.', 404);
    await this.middleCategoryRepository.save({
      name: createMiddleCategory.name,
      largeCategory: { id: createMiddleCategory.largeCategoryId },
    });
    return { message: '카테고리(중)가 등록되었습니다.' };
  }
  // 카테고리(중) 전체 조회
  async findMiddleCategory(): Promise<MiddleCategory[]> {
    return await this.middleCategoryRepository.find();
  }
  // 카테고리(중) 상세조회
  async findByMiddleCategory(id: number): Promise<MiddleCategory> {
    const middleCategory = await this.middleCategoryRepository.findOne({ where: { id }, relations: ['smallCategories'] });
    if (!middleCategory) throw new HttpException('카테고리를 찾지 못했습니다.', 404);
    return middleCategory;
  }
  // 카테고리(중) 수정
  async updateMiddleCategory(id: number, updateData: UpdateCategoryDto): Promise<IMessage> {
    const modifyCategory = await this.middleCategoryRepository.findOne({ where: { id } });
    if (!modifyCategory) throw new HttpException('수정할 카테고리가 없습니다.', 404);
    // -> 수정하는 단계
    await this.middleCategoryRepository.update({ id }, { name: updateData.name });
    return { message: '카테고리(중)가 수정되었습니다.' };
  }
  // 카테고리(중) 삭제
  async deleteMiddleCategory(id: number): Promise<IMessage> {
    const existCategory = await this.middleCategoryRepository.findOne({ where: { id } });
    if (!existCategory) throw new HttpException('삭제할 카테고리를 찾을 수 없습니다.', 404);
    // -> 삭제하는 단계
    await this.middleCategoryRepository.delete({ id });
    return { message: '카테고리(중)가 삭제되었습니다.' };
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
  async getSmallCategoryById(id: number): Promise<SmallCategory> {
    return this.smallCategoryRepository.findOne({ where: { id } });
  }
  // 카테고리(소) 수정
  async updateSmallCategory(id: number, name: string): Promise<IMessage> {
    const category = await this.smallCategoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('해당하는 카테고리가 없습니다.');
    }
    category.name = name;
    await this.smallCategoryRepository.save(category);
    return { message: '카테고리(소)가 수정되었습니다.' };
  }
  // 카테고리(소) 삭제
  async deleteSmallCategory(id: number): Promise<IMessage> {
    const category = this.smallCategoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('해당하는 카테고리가 없습니다.');
    }
    await this.smallCategoryRepository.delete(id);
    return { message: '카테고리(소)가 삭제되었습니다. ' };
  }
}
