import { Injectable } from '@nestjs/common';
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

  //   async findOneLargeCategory(name: string) {
  //     return await this.largeCategoriesRepository.findOne({ where: { name } });
  //   }
}
