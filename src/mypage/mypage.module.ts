import { Module } from '@nestjs/common';
import { MypageService } from './mypage.service';
import { MypageController } from './mypage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../_common/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [MypageController],
  providers: [MypageService],
})
export class MypageModule {}
