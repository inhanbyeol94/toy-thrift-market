import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { LargeCategoryDto, SmallCategoryDto, UpdateCategoryDto } from '../_common/dtos/categories.dto';
import { CreateMiddleCategoryDto } from '../_common/dtos/middlecategory.dto';
import { IMessage } from '../_common/interfaces/message.interface';
import { LargeCategory, MiddleCategory, SmallCategory } from '../_common/entities';
@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  // 카테고리(대) 추가
  @Post('large')
  @HttpCode(200)
  createLargeCategory(@Body() data: LargeCategoryDto): Promise<LargeCategory> {
    const { name } = data;
    return this.categoryService.createLargeCategory(name);
  }
  // 모든 카테고리(대) 조회
  @Get('large')
  @HttpCode(200)
  getAllLargeCategories(): Promise<LargeCategory[]> {
    return this.categoryService.findAllLargeCategories();
  }
  // 카테고리(대) 수정
  @Patch('large/:id')
  @HttpCode(200)
  async updateLargeCategory(@Param('id') id: number, @Body() data: UpdateCategoryDto): Promise<IMessage> {
    return await this.categoryService.updateLargeCategory(id, data.name);
  }
  // 카테고리(대) 삭제
  @Delete('large/:id')
  @HttpCode(200)
  async removeLargeCategory(@Param('id') id: number): Promise<IMessage> {
    return await this.categoryService.deleteLargeCategory(id);
  }

  // 카테고리(중)등록
  @Post('middle')
  @HttpCode(200)
  async createMiddleCategory(@Body() middleData: CreateMiddleCategoryDto): Promise<IMessage> {
    return await this.categoryService.createMiddleCategory(middleData);
  }
  // 카테고리(중)조회
  @Get('middle')
  @HttpCode(200)
  async findMiddleCategory(): Promise<MiddleCategory[]> {
    return await this.categoryService.findMiddleCategory();
  }
  // 카테고리(중)상세조회
  @Get('middle/:id')
  @HttpCode(200)
  async findByMiddleCategory(@Param('id') id: number): Promise<MiddleCategory> {
    return await this.categoryService.findByMiddleCategory(id);
  }
  // 카테고리(중)수정
  @Patch('middle/:id')
  @HttpCode(200)
  async updateMiddleCategory(@Param('id') id: number, @Body() updateData: UpdateCategoryDto): Promise<IMessage> {
    return await this.categoryService.updateMiddleCategory(id, updateData);
  }
  // 카테고리(중)삭제
  @Delete('middle/:id')
  @HttpCode(200)
  async deleteMiddleCategory(@Param('id') id: number): Promise<IMessage> {
    return await this.categoryService.deleteMiddleCategory(id);
  }
  // 카테고리(소) 생성
  @Post('/small')
  @HttpCode(201)
  async createSmallCategory(@Body() smallCategoryData: SmallCategoryDto): Promise<IMessage> {
    return await this.categoryService.createSmallCategory(smallCategoryData);
  }
  // 카테고리(소) 조회
  @Get('/small')
  @HttpCode(200)
  async getSmallCategory(): Promise<SmallCategory[]> {
    return this.categoryService.getSmallCategory();
  }
  // 카테고리(소) 개별 조회
  @Get('/small/:id')
  @HttpCode(200)
  async getSmallCategoryById(@Param('id') id: number): Promise<SmallCategory> {
    return this.categoryService.getSmallCategoryById(id);
  }
  // 카테고리(소) 수정
  @Patch('/small/:id')
  @HttpCode(200)
  async updateSmallCategory(@Param('id') id: number, @Body() data: UpdateCategoryDto): Promise<IMessage> {
    return this.categoryService.updateSmallCategory(id, data.name);
  }
  // 카테고리(소) 삭제
  @Delete('/small/:id')
  @HttpCode(200)
  async deleteSmallCategory(@Param('id') id: number): Promise<IMessage> {
    return this.categoryService.deleteSmallCategory(id);
  }

  // 카테고리 (소)의 상위 미들, 라지 카테고리 조회
  @Get('small/:id/parent')
  @HttpCode(200)
  async getParentBySmallCategoryId(@Param('id') id: number): Promise<SmallCategory> {
    return this.categoryService.findParentBySmallCategoryId(id);
  }
}
