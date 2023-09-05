import { Body, Controller, Delete, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { AdminProductService } from './admin-product.service';
import { AdminGuard } from 'src/_common/guards/admin.guard';
import { UpdateProductDto } from 'src/_common/dtos/update-product.dto';
import { IRequest } from 'src/_common/interfaces/request.interface';
import { IMessage } from 'src/_common/interfaces/message.interface';

@Controller('admin-products')
export class AdminProductController {
  constructor(private readonly adminProductService: AdminProductService) {}

  // 상품 수정
  @Patch(':id')
  @UseGuards(AdminGuard)
  async update(@Param('id') id: number, @Body() data: UpdateProductDto, @Req() req: IRequest): Promise<IMessage> {
    const _files = req.files;
    return await this.adminProductService.update(id, data, _files);
  }

  // 상품 삭제
  @Delete(':id')
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: number): Promise<IMessage> {
    return await this.adminProductService.remove(id);
  }
}
