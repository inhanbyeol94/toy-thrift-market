import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode } from '@nestjs/common';
import { ReViewService } from './review.service';
import { CreateReViewDto, UpdateReViewDto } from '../_common/dtos/review.dto';
import { AuthGuard } from 'src/_common/guards/auth.guard';
import { IRequest } from 'src/_common/interfaces/request.interface';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { Review } from 'src/_common/entities';

@Controller('reviews')
export class ReViewController {
  constructor(private readonly reViewService: ReViewService) {}

  // 리뷰생성
  @Post(':productId')
  @UseGuards(AuthGuard)
  @HttpCode(201)
  async addReview(@Param('productId') productId: number, @Req() req: IRequest, @Body() createData: CreateReViewDto): Promise<IMessage> {
    const { id } = req.user;
    return await this.reViewService.addReview(productId, id, createData);
  }

  // 리뷰수정
  @Patch(':reviewId')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async editReview(@Param('reviewId') reviewId: number, @Req() req: IRequest, @Body() updateData: UpdateReViewDto): Promise<IMessage> {
    const { id } = req.user;
    return await this.reViewService.editReview(reviewId, id, updateData);
  }

  // 리뷰 조회
  @Get(':reviewId')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async getReview(@Param('reviewId') reviewId: number, @Req() req: IRequest): Promise<Review> {
    const { id } = req.user;
    return await this.reViewService.getReview(reviewId, id);
  }

  // 리뷰 삭제
  @Delete(':reviewId')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async deleteReview(@Param('reviewId') reviewId: number, @Req() req: IRequest): Promise<IMessage> {
    const { id } = req.user;
    return this.reViewService.deleteReview(reviewId, id);
  }
}
