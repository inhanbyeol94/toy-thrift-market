import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment, Document, Member } from 'src/_common/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Comment, Document])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
