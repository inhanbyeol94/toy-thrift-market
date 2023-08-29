import { Controller, Param, Delete, HttpCode } from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { IMessage } from 'src/_common/interfaces/message.interface';

@Controller('product-images')
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param() id: number): Promise<IMessage> {
    return await this.productImageService.remove(id);
  }
}
