import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AdminMainPageController } from './admin-mainboard.controller';
import { AdminMainboardService } from './admin-mainboard.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MainPage, MainPageSchema } from '../_common/schema/like.schema';
import { ViewAdminMiddleware } from '../_common/middlewares/view.admin.middleware';
import { UploadService } from '../upload/upload.service';
import { TokenValidMiddleware } from '../_common/middlewares/token.valid.middleware';
import { UploadMiddleware } from 'src/_common/middlewares/upload.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forFeature([{ name: MainPage.name, schema: MainPageSchema }])],
  controllers: [AdminMainPageController],
  providers: [AdminMainboardService, ViewAdminMiddleware, UploadService, JwtService],
})
export class AdminMainboardModule {
  configure(consumer: MiddlewareConsumer) {
    /* 토큰 미들웨어 */
    consumer.apply(TokenValidMiddleware).forRoutes(AdminMainPageController);
    consumer.apply(UploadMiddleware).forRoutes({ path: '/admin-mainboards', method: RequestMethod.PATCH });
  }
}
