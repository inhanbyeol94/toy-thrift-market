import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { AdminProductService } from './admin-product.service';
import { AdminGuard } from 'src/_common/guards/admin.guard';
import { UpdateProductDto } from 'src/_common/dtos/update-product.dto';
import { IRequest } from 'src/_common/interfaces/request.interface';
import { IMessage } from 'src/_common/interfaces/message.interface';

@Controller('admin-products')
@UseGuards(AdminGuard)
export class AdminProductController {
  constructor(private readonly adminProductService: AdminProductService) {}

  // 상품 수정
  @Patch(':id')
  async update(@Param('id') id: number, @Body() data: UpdateProductDto, @Req() req: IRequest): Promise<IMessage> {
    const _files = req.files;
    return await this.adminProductService.update(id, data, _files);
  }

  // 상품 삭제
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<IMessage> {
    return await this.adminProductService.remove(id);
  }

  //  상품 카테고리별 조회
  @Get('categories/:categoryId')
  @HttpCode(200)
  async getProductsByCategory(@Param('categoryId') categoryId: number) {
    return await this.adminProductService.findProductsByCategory(categoryId);
  }
}
