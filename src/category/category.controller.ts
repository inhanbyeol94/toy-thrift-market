import { CreateLargeCategoryDto } from './../_common/dtos/largeCategory.dto';
import { CategoryService } from './category.service';
import { Body, Controller, Get, Patch, Post } from '@nestjs/common';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // 카테고리(대) 추가
  @Post('large')
  createLargeCategory(@Body() createLargeCategoryDto: CreateLargeCategoryDto) {
    const { name } = createLargeCategoryDto;
    return this.categoryService.createLargeCategory(name);
  }

  // 모든 카테고리(대) 조회
  @Get('large')
  getAllLargeCategories() {
    return this.categoryService.findAllLargeCategories();
  }
}

//   @Patch('large')
//   @Delete('large')
