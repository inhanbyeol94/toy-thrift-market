import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from 'src/_common/typeorm.config';
import { ViewModule } from './view/view.module';
import { AuthModule } from './auth/auth.module';
import { MemberModule } from './member/member.module';
import { CategoryModule } from './category/category.module';
import { AdminMemberModule } from './admin-member/admin-member.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TypeOrmModule.forRootAsync({ useFactory: ormConfig }), ViewModule, MemberModule, AuthModule, CategoryModule, AdminMemberModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
