import { MiddlewareConsumer, Module } from '@nestjs/common';
import { EasyPasswordService } from './easy-password.service';
import { EasyPasswordController } from './easy-password.controller';
import { EasyPassword } from 'src/_common/entities/easy-password.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenValidMiddleware } from 'src/_common/middlewares/token.valid.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([EasyPassword])],
  controllers: [EasyPasswordController],
  providers: [EasyPasswordService, JwtService],
})
export class EasyPasswordModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenValidMiddleware).forRoutes(EasyPasswordController);
  }
}
