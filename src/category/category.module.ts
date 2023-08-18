import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmallCategory } from 'src/_common/entities/smallCategory.entity';
import { MiddleCategory } from 'src/_common/entities/middleCategory.entity';
import { LargeCategory } from 'src/_common/entities/largeCategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SmallCategory, MiddleCategory, LargeCategory])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
