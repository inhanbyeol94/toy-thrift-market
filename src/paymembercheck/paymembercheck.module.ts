import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PaymembercheckService } from './paymembercheck.service';
import { PaymembercheckController } from './paymembercheck.controller';
import { Member, Product, Trade } from 'src/_common/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenValidMiddleware } from 'src/_common/middlewares/token.valid.middleware';
import { JwtService } from '@nestjs/jwt';
import { TradesService } from 'src/trades/trades.service';

@Module({
  imports: [TypeOrmModule.forFeature([Trade, Product, Member])],
  controllers: [PaymembercheckController],
  providers: [PaymembercheckService, JwtService, TradesService],
})
export class PaymembercheckModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenValidMiddleware).forRoutes(PaymembercheckController);
  }
}
