import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddleCategory } from '../_common/entities/middleCategory.entity';
import { LargeCategory } from '../_common/entities/largeCategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MiddleCategory, LargeCategory])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
