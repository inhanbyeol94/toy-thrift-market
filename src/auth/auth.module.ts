import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/_common/entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
