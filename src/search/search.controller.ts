import { Controller, Get, Query } from '@nestjs/common';
import { ISearchQuery } from 'src/_common/interfaces/searchQuery.interface';
import { SearchService } from 'src/search/search.service';

@Controller('searches')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  async searchProduct(@Query() data: ISearchQuery) {
    return await this.searchService.searchProduct(data);
  }
}
