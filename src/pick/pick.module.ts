import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PickService } from './pick.service';
import { PickController } from './pick.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member, Pick, Product } from 'src/_common/entities';
import { TokenValidMiddleware } from 'src/_common/middlewares/token.valid.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Product, Pick])],
  controllers: [PickController],
  providers: [PickService, JwtService],
})
export class PickModule {
  configure(consumer: MiddlewareConsumer) {
    /* 토큰 미들웨어 */
    consumer.apply(TokenValidMiddleware).forRoutes(PickController);
  }
}
