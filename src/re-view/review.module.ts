import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ReViewService } from './review.service';
import { ReViewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member, Product, Review, Trade } from 'src/_common/entities';
import { TokenValidMiddleware } from 'src/_common/middlewares/token.valid.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Trade, Product, Review, Member])],
  controllers: [ReViewController],
  providers: [ReViewService, JwtService],
})
export class ReViewModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenValidMiddleware).forRoutes(ReViewController);
  }
}
