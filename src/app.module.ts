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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    ViewModule,
    MemberModule,
    AuthModule,
    CategoryModule,
    AdminMemberModule,
    BoardModule,
    AdminBoardModule,
    MainDocumentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
