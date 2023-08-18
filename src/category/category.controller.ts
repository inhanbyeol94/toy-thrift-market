import { CreateLargeCategoryDto, UpdateLargeCategoryDto } from './../_common/dtos/largeCategory.dto';
import { CategoryService } from './category.service';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

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

  @Patch('large/:id')
  updateLargeCategory(@Param('id') id: number, @Body() data: UpdateLargeCategoryDto) {
    this.categoryService.updateLargeCategory(id, data.name);
  }

  @Delete('large/:id')
  removeLargeCategory(@Param('id') id: number) {
    this.categoryService.deleteLargeCategory(id);
  }
}
