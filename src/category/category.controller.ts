import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { LargeCategoryDto, SmallCategoryDto } from '../_common/dtos/categories.dto';
import { CreateMiddleCategoryDto } from '../_common/dtos/middlecategory.dto';
import { IMessage } from '../_common/interfaces/message.interface';
import { MiddleCategory } from '../_common/entities';
@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  // 카테고리(대) 추가
  @Post('large')
  createLargeCategory(@Body() data: LargeCategoryDto) {
    const { name } = data;
    return this.categoryService.createLargeCategory(name);
  }
  // 모든 카테고리(대) 조회
  @Get('large')
  getAllLargeCategories() {
    return this.categoryService.findAllLargeCategories();
  }
  // 카테고리 수정
  @Patch('large/:id')
  updateLargeCategory(@Param('id') id: number, @Body() data: LargeCategoryDto) {
    this.categoryService.updateLargeCategory(id, data.name);
  }
  // 카테고리 삭제
  @Delete('large/:id')
  removeLargeCategory(@Param('id') id: number) {
    this.categoryService.deleteLargeCategory(id);
  }
  // 카테고리(중)
  // 등록
  @Post('middle')
  @HttpCode(200)
  async createMiddleCategory(@Body() middleData: CreateMiddleCategoryDto): Promise<IMessage> {
    return await this.categoryService.createMiddleCategory(middleData);
  }
  // 조회
  @Get('middle')
  @HttpCode(200)
  async findMiddleCategory(): Promise<MiddleCategory[]> {
    return await this.categoryService.findMiddleCategory();
  }
  // 상세조회
  @Get('middle/:id')
  @HttpCode(200)
  async findByMiddleCategory(@Param('id') id: number): Promise<MiddleCategory> {
    return await this.categoryService.findByMiddleCategory(id);
  }
  // 수정
  @Patch('middle/:id')
  @HttpCode(200)
  async updateMiddleCategory(@Param('id') id: number, @Body() updateData: CreateMiddleCategoryDto): Promise<IMessage> {
    return await this.categoryService.updateMiddleCategory(id, updateData);
  }
  // 삭제
  @Delete('middle/:id')
  @HttpCode(200)
  async deleteMiddleCategory(@Param('id') id: number): Promise<IMessage> {
    return await this.categoryService.deleteMiddleCategory(id);
  }
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
