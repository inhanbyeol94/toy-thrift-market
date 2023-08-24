import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment, Document, Member } from 'src/_common/entities';
import { SlackModule } from 'src/slack/slack.module';
import { JwtService } from '@nestjs/jwt';
import { TokenValidMiddleware } from 'src/_common/middlewares/token.valid.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Comment, Document]), SlackModule],
  controllers: [CommentController],
  providers: [CommentService, JwtService],
})
export class CommentModule {
  configure(consumer: MiddlewareConsumer) {
    /* 토큰 미들웨어 */
    consumer.apply(TokenValidMiddleware).forRoutes(CommentController);
  }
}
