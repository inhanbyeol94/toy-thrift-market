import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MainDocumentController } from './main-document.controller';
import { MainDocumentService } from './main-document.service';
import { Board, Document, Member } from 'src/_common/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlackModule } from '../slack/slack.module';
import { TokenValidMiddleware } from 'src/_common/middlewares/token.valid.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Board, Document]), SlackModule],
  controllers: [MainDocumentController],
  providers: [MainDocumentService, JwtService],
})
export class MainDocumentModule {
  configure(consumer: MiddlewareConsumer) {
    /* 토큰 미들웨어 */
    consumer.apply(TokenValidMiddleware).forRoutes(MainDocumentController);
  }
}
