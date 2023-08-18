import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LargeCategory } from 'src/_common/entities/largeCategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LargeCategory])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
