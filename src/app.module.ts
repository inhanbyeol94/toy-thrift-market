import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from 'src/_common/typeorm.config';
import { ViewModule } from './view/view.module';
import { MemberModule } from './member/member.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TypeOrmModule.forRootAsync({ useFactory: ormConfig }), ViewModule, MemberModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
