import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/_common/entities';
import { ISearchQuery } from 'src/_common/interfaces/searchQuery.interface';
import { Like, Repository } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(@InjectRepository(Product) private searchRepository: Repository<Product>) {}

  async searchProduct(data: ISearchQuery): Promise<any> {
    console.log(data.product);
    const take = 12;
    const result = await this.searchRepository.find({
      take,
      skip: ((data.page || 1) - 1) * take,
      where: {
        name: Like(`%${data.product || ''}%`),
        smallCategory: { id: data.smallCategory, middleCategory: { id: data.middleCategory, largeCategory: { id: data.largeCategory } } },
      },
      relations: ['smallCategory', 'smallCategory.middleCategory', 'smallCategory.middleCategory.largeCategory', 'member'],
    });

    return { data: result };
  }
}
