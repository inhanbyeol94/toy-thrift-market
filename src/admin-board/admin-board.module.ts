import { Module } from '@nestjs/common';
import { AdminBoardController } from './admin-board.controller';
import { AdminBoardService } from './admin-board.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from '../_common/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Board])],
  controllers: [AdminBoardController],
  providers: [AdminBoardService],
})
export class AdminBoardModule {}
