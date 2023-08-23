import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from '../_common/dtos/create-comment.dto';
import { UpdateCommentDto } from '../_common/dtos/update-comment.dto';
import { IMessage } from '../_common/interfaces/message.interface';
import { Comment } from 'src/_common/entities';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  // 댓글 작성
  @Post()
  @HttpCode(201)
  async createComment(@Body() data: CreateCommentDto): Promise<IMessage> {
    return await this.commentService.createComment(data);
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
  @HttpCode(200)
  async updateComment(@Param('id') id: number, @Body() data: UpdateCommentDto): Promise<IMessage> {
    return await this.commentService.updateComment(id, data);
  }
  // 댓글 삭제
  @Delete(':id')
  @HttpCode(200)
  async deleteComment(@Param('id') id: number): Promise<IMessage> {
    return await this.commentService.deleteComment(id);
  }
}
