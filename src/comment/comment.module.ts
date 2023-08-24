import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment, Document, Member } from 'src/_common/entities';
import { SlackModule } from 'src/slack/slack.module';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Comment, Document]), SlackModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
