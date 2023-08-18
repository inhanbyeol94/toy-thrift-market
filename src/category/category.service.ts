import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LargeCategory } from 'src/_common/entities/largeCategory.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(LargeCategory) private largeCategoriesRepository: Repository<LargeCategory>) {}

  async createLargeCategory(name: string): Promise<LargeCategory> {
    const largeCategory = this.largeCategoriesRepository.create({ name });
    await this.largeCategoriesRepository.save(largeCategory);
    return largeCategory;
  }

  async findAllLargeCategories() {
    const largeCategories = await this.largeCategoriesRepository.find();
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

  //   async findOneLargeCategory(name: string) {
  //     return await this.largeCategoriesRepository.findOne({ where: { name } });
  //   }
}
