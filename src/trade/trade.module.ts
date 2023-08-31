import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { Member, Product, Trade } from 'src/_common/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImageModule } from 'src/product-image/product-image.module';
import { JwtService } from '@nestjs/jwt';
import { TokenValidMiddleware } from 'src/_common/middlewares/token.valid.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Trade, Product, Member]), ProductImageModule],
  controllers: [TradeController],
  providers: [TradeService, JwtService],
})
export class TradeModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenValidMiddleware).forRoutes(TradeController);
  }
}
