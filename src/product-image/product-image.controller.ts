import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductImageService } from './product-image.service';

@Controller('product-images')
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}
}
