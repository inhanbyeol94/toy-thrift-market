import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MiddleCategory } from '../_common/entities/middleCategory.entity';
import { Repository } from 'typeorm';
import { CreateMiddleCategoryDto } from '../_common/dtos/middlecategory.dto';
import { IMessage } from '../_common/interfaces/message.interface';
import { LargeCategory } from '../_common/entities/largeCategory.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(MiddleCategory) private middleCategoryRepository: Repository<MiddleCategory>,
    @InjectRepository(LargeCategory) private largeCategoryRepository: Repository<LargeCategory>,
  ) {}

  // 등록
  async createMiddleCategory(createMiddleCategory: CreateMiddleCategoryDto): Promise<IMessage> {
    // 등록된 카테고리 확인
    const { name } = createMiddleCategory;

    const existingLargeCategory = await this.largeCategoryRepository.findOne({ where: { id: createMiddleCategory.largeCategoryId } });
    if (!existingLargeCategory) throw new HttpException('존재하지 않는 카테고리입니다.', 404);

    const existingMiddleCategory = await this.middleCategoryRepository.findOne({ where: { name } });
    if (existingMiddleCategory) throw new HttpException('이미 등록된 카테고리입니다.', 404);

    await this.middleCategoryRepository.save({
      name: createMiddleCategory.name,
      largeCategory: createMiddleCategory.largeCategoryId,
    });

    return { message: '(중)카테고리가 등록되었습니다.' };
  }

  //전체 조회
  async findMiddleCategory(): Promise<MiddleCategory[]> {
    return await this.middleCategoryRepository.find();
  }

  // 상세조회
  async findByMiddleCategory(id: number): Promise<MiddleCategory> {
    const middleCategory = await this.middleCategoryRepository.findOne({ where: { id } });
    if (!middleCategory) throw new HttpException('카테고리를 찾지 못했습니다.', 404);
    return middleCategory;
  }
  // 수정
  async updateMiddleCategory(id: number, updateData: CreateMiddleCategoryDto): Promise<IMessage> {
    const modifyCategory = await this.middleCategoryRepository.findOne({ where: { id } });
    if (!modifyCategory) throw new HttpException('수정할 카테고리가 없습니다.', 404);

    // -> 수정하는 단계
    await this.middleCategoryRepository.update({ id }, { name: updateData.name });
    return { message: '(중)카테고리가 수정되었습니다.' };
  }

  // 삭제
  async deleteMiddleCategory(id: number): Promise<IMessage> {
    const existCategory = await this.middleCategoryRepository.findOne({ where: { id } });
    if (!existCategory) throw new HttpException('삭제할 카테고리를 찾을 수 없습니다.', 404);

    // -> 삭제하는 단계
    await this.middleCategoryRepository.delete({ id });
    return { message: '카테고리가 삭제되었습니다.' };
  }
}
