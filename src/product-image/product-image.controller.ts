import { Controller, Param, Delete, HttpCode, Patch, Body } from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { UpdateProductImagePositionDto } from 'src/_common/dtos/product-image.dto';

@Controller('product-images')
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @Patch('position')
  @HttpCode(200)
  async updatePosition(@Body() data: UpdateProductImagePositionDto) {
    return await this.productImageService.updatePosition(data);
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param() id: number): Promise<IMessage> {
    return await this.productImageService.remove(id);
  }
}
