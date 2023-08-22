import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Pick, Product } from 'src/_common/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Pick])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
