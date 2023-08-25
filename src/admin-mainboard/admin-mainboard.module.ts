import { Module } from '@nestjs/common';
import { AdminMainPageController } from './admin-mainboard.controller';
import { AdminMainboardService } from './admin-mainboard.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MainPage, MainPageSchema } from '../_common/schema/like.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: MainPage.name, schema: MainPageSchema }])],
  controllers: [AdminMainPageController],
  providers: [AdminMainboardService],
})
export class AdminMainboardModule {}
