import { CreateLargeCategoryDto } from './../_common/dtos/largeCategory.dto';
import { CategoryService } from './category.service';
import { Body, Controller, Patch, Post } from '@nestjs/common';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('large')
  createLargeCategory(@Body() createLargeCategoryDto: CreateLargeCategoryDto) {
    const { name } = createLargeCategoryDto;
    return this.categoryService.createLargeCategory(name);
  }
}

//   @Get('large')
//   @Patch('large')
//   @Delete('large')
