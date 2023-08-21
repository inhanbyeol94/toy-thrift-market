import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from '../_common/dtos/create-product.dto';
import { UpdateProductDto } from '../_common/dtos/update-product.dto';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { Product } from 'src/_common/entities';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // 상품 추가
  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<IMessage> {
    return await this.productService.create(createProductDto);
  }

  // 상품 전체 조회
  @Get()
  async findAll(): Promise<Product[]> {
    return await this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return await this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productService.remove(+id);
  }
}
