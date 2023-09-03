import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/_common/entities';
import { TokenValidMiddleware } from 'src/_common/middlewares/token.valid.middleware';
import { ViewAdminMiddleware } from 'src/_common/middlewares/view.admin.middleware';
import { ViewAuthMiddleware } from 'src/_common/middlewares/view.auth.middleware';
import { ViewController } from './view.controller';
import { ViewService } from './view.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ViewController],
  providers: [ViewService, JwtService],
})
export class ViewModule {
  configure(consumer: MiddlewareConsumer) {
    /* 토큰 미들웨어 */
    consumer.apply(TokenValidMiddleware).forRoutes(ViewController);

    /* 로그인 제한 미들웨어*/
    consumer
      .apply(ViewAuthMiddleware)
      .forRoutes(
        { path: '/myprofile', method: RequestMethod.GET },
        { path: '/pick', method: RequestMethod.GET },
        { path: '/my-products', method: RequestMethod.GET },
        { path: '/mypage/products/new', method: RequestMethod.GET },
        { path: 'product/:id/edit', method: RequestMethod.GET },
        { path: 'purchase-history', method: RequestMethod.GET },
      );

    /* 로그인 & 관리자 제한 미들웨어 */
    consumer.apply(ViewAdminMiddleware).forRoutes({ path: '/admins/*', method: RequestMethod.GET });
  }
}
