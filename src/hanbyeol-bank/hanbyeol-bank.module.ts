import { Module } from '@nestjs/common';
import { HanbyeolBankService } from './hanbyeol-bank.service';
import { HanbyeolBankController } from './hanbyeol-bank.controller';

@Module({
  controllers: [HanbyeolBankController],
  providers: [HanbyeolBankService],
})
export class HanbyeolBankModule {}
