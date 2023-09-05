import { Controller, Post, Body, HttpCode, Req } from '@nestjs/common';
import { HanbyeolBankService } from './hanbyeol-bank.service';
import { RequestIdentityVerificationDto, VerifyAccountNumberDto, VerifyIdentityDto } from 'src/_common/dtos/verify-account-number.dto';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { IRequest } from 'src/_common/interfaces/request.interface';

@Controller('hanbyeol-banks')
export class HanbyeolBankController {
  constructor(private readonly hanbyeolBankService: HanbyeolBankService) {}

  @Post('identity')
  @HttpCode(201)
  async requestIdentityVerification(@Req() req: IRequest, @Body() data: RequestIdentityVerificationDto): Promise<IMessage> {
    const { id: userId } = req.user;
    const result = await this.hanbyeolBankService.requestIdentityVerification(userId, data);
    return result;
  }

  @Post('/identity/verify')
  @HttpCode(201)
  async verifyIdentity(@Body() data: VerifyIdentityDto) {
    const isVerified = await this.hanbyeolBankService.verifyIdentity(data);
    return isVerified;
  }

  @Post('/account/verify')
  @HttpCode(201)
  async verifyAccountNumber(@Body() data: VerifyAccountNumberDto): Promise<IMessage> {
    const result = await this.hanbyeolBankService.verifyAccountNumber(data);
    return result;
  }
}
