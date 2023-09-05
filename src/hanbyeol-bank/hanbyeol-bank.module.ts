import { MiddlewareConsumer, Module } from '@nestjs/common';
import { HanbyeolBankService } from './hanbyeol-bank.service';
import { HanbyeolBankController } from './hanbyeol-bank.controller';
import { TokenValidMiddleware } from 'src/_common/middlewares/token.valid.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/_common/entities';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],

  controllers: [HanbyeolBankController],
  providers: [HanbyeolBankService, JwtService],
})
export class HanbyeolBankModule {
  configure(consumer: MiddlewareConsumer) {
    /* 토큰 미들웨어 */
    consumer.apply(TokenValidMiddleware).forRoutes(HanbyeolBankController);
  }
}
