import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PaymembercheckService } from './paymembercheck.service';
import { PaymembercheckController } from './paymembercheck.controller';
import { Member, Product } from 'src/_common/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenValidMiddleware } from 'src/_common/middlewares/token.valid.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Product])],
  controllers: [PaymembercheckController],
  providers: [PaymembercheckService, JwtService],
})
export class PaymembercheckModule {
  configure(consumer: MiddlewareConsumer) {
    /* 토큰 미들웨어 */
    consumer.apply(TokenValidMiddleware).forRoutes(PaymembercheckController);
  }
}
