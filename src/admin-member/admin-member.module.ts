import { Module } from '@nestjs/common';
import { AdminMemberService } from './admin-member.service';
import { AdminMemberController } from './admin-member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../_common/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [AdminMemberController],
  providers: [AdminMemberService],
})
export class AdminMemberModule {}
