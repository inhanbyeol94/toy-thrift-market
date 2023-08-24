import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../_common/entities/member.entity';
import { UploadService } from '../upload/upload.service';
import { TokenValidMiddleware } from '../_common/middlewares/token.valid.middleware';

import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [MemberController],
  providers: [MemberService, UploadService, JwtService],
})
export class MemberModule {
  configure(consumer: MiddlewareConsumer) {
    /* 토큰 미들웨어 */
    consumer.apply(TokenValidMiddleware).forRoutes(MemberController);
  }
}
