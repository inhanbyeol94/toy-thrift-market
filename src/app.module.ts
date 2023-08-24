import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from 'src/_common/typeorm.config';
import { ViewModule } from './view/view.module';
import { AuthModule } from './auth/auth.module';
import { MemberModule } from './member/member.module';
import { CategoryModule } from './category/category.module';
import { AdminMemberModule } from './admin-member/admin-member.module';
import { BoardModule } from './board/board.module';
import { AdminBoardModule } from './admin-board/admin-board.module';
import { MainDocumentModule } from './main-document/main-document.module';
import { CommentModule } from './comment/comment.module';
import { SlackModule } from './slack/slack.module';
import { UploadModule } from './upload/upload.module';
import { ProductModule } from './product/product.module';
import { IdentityModule } from './identity/identity.module';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          store: redisStore,
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
          // password: process.env.REDIS_PASSWORD,
        };
      },
    }),
    ViewModule,
    MemberModule,
    AuthModule,
    CategoryModule,
    AdminMemberModule,
    BoardModule,
    AdminBoardModule,
    MainDocumentModule,
    CommentModule,
    SlackModule,
    UploadModule,
    ProductModule,
    IdentityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
