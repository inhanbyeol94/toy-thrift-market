import { Module } from '@nestjs/common';
import { AdminMainPageController } from './admin-mainboard.controller';
import { AdminMainboardService } from './admin-mainboard.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MainPage, MainPageSchema } from '../_common/schema/like.schema';
import { ViewAdminMiddleware } from '../_common/middlewares/view.admin.middleware';

@Module({
  imports: [MongooseModule.forFeature([{ name: MainPage.name, schema: MainPageSchema }])],
  controllers: [AdminMainPageController],
  providers: [AdminMainboardService, ViewAdminMiddleware],
})
export class AdminMainboardModule {}
