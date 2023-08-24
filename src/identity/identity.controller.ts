import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ISequence } from 'src/_common/interfaces/sequence.interface';
import { IMessage } from '../_common/interfaces/message.interface';
import { IdentityService } from './identity.service';
import { VerificationRequestDto } from '../_common/dtos/identityVerificationRequest.dto';
import { IdentityVerifyDto } from '../_common/dtos/identityVerify.dto';

@Controller('identities')
export class IdentityController {
  constructor(private identityService: IdentityService) {}

  @Post()
  @HttpCode(200)
  async sendAuthentication(@Body() identityData: VerificationRequestDto): Promise<ISequence> {
    return await this.identityService.sendAuthentication(identityData);
  }

  @Post('verify')
  @HttpCode(200)
  async verifyIdentity(@Body() verifyData: IdentityVerifyDto): Promise<ISequence> {
    return await this.identityService.verifyAuthentication(verifyData);
  }
}
