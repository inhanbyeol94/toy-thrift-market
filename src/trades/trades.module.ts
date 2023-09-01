import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TradesService } from './trades.service';
import { TradesController } from './trades.controller';
import { Member, Product, Trade } from 'src/_common/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenValidMiddleware } from 'src/_common/middlewares/token.valid.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Trade, Product, Member])],
  controllers: [TradesController],
  providers: [TradesService, JwtService],
})
export class TradesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenValidMiddleware).forRoutes(TradesController);
  }
}
