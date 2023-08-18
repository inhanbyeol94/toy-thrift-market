import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateMiddleCategoryDto } from '../_common/dtos/middlecategory.dto';
import { IMessage } from '../_common/interfaces/message.interface';
import { MiddleCategory } from '../_common/entities/middleCategory.entity';

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

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
}
