import { Controller, Post, HttpCode, Body, Get, Patch, Delete, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { SmallCategoryDto } from '../_common/dtos/categories.dto';
// import { IMessage } from '../_common/interfaces/message.interface';

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  // 카테고리(소) 생성
  @Post('/small')
  @HttpCode(201)
  async createSmallCategory(@Body() smallCategoryData: SmallCategoryDto) {
    return await this.categoryService.createSmallCategory(smallCategoryData);
  }

  // 카테고리(소) 조회
  @Get('/small')
  @HttpCode(200)
  async getSmallCategory() {
    return this.categoryService.getSmallCategory();
  }

  // 카테고리(소) 개별 조회
  @Get('/small/:id')
  @HttpCode(200)
  async getSmallCategoryById(@Param('id') id: number) {
    return this.categoryService.getSmallCategoryById(id);
  }

  // 카테고리(소) 수정
  @Patch('/small/:id')
  @HttpCode(200)
  async updateSmallCategory(@Param('id') id: number, @Body() data: SmallCategoryDto) {
    return this.categoryService.updateSmallCategory(id, data.name);
  }

  // 카테고리(소) 삭제
  @Delete('/small/:id')
  @HttpCode(200)
  async deleteSmallCategory(@Param('id') id: number) {
    return this.categoryService.deleteSmallCategory(id);
  }
}
