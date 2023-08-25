import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, Req } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from '../_common/dtos/create-comment.dto';
import { UpdateCommentDto } from '../_common/dtos/update-comment.dto';
import { IMessage } from '../_common/interfaces/message.interface';
import { Comment } from 'src/_common/entities';
import { AuthGuard } from 'src/_common/guards/auth.guard';
import { IRequest } from 'src/_common/interfaces/request.interface';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  // 댓글 작성
  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(201)
  async createComment(@Body() data: CreateCommentDto, @Req() req: IRequest): Promise<IMessage> {
    const { id } = req.user;
    return await this.commentService.createComment(data, id);
  }
  // 댓글 조회
  @Get(':documentId')
  @HttpCode(200)
  async getComments(@Param('documentId') documentId: number): Promise<Comment[]> {
    return await this.commentService.getComments(documentId);
  }
  // 댓글 상세 조회
  @Get('detail/:id')
  @HttpCode(200)
  async getOneComment(@Param('id') id: number): Promise<Comment> {
    return await this.commentService.getOneComment(id);
  }
  // 댓글 수정
  @Patch(':id')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async updateComment(@Param('id') commentId: number, @Body() data: UpdateCommentDto, @Req() req: IRequest): Promise<IMessage> {
    const { id } = req.user;
    return await this.commentService.updateComment(commentId, data, id);
  }
  // 댓글 삭제
  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async deleteComment(@Param('id') commentId: number, @Req() req: IRequest): Promise<IMessage> {
    const { id } = req.user;
    return await this.commentService.deleteComment(commentId, id);
  }
}
