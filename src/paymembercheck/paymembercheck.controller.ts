import { Controller, Post, Body, UseGuards, HttpCode, Req } from '@nestjs/common';
import { PaymembercheckService } from './paymembercheck.service';
import { AuthGuard } from 'src/_common/guards/auth.guard';
import { IRequest } from 'src/_common/interfaces/request.interface';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { PayAccountCheckDto, PaymemberCheckDto, PayverifyDto, transferDto } from 'src/_common/dtos/paymentcheck.dto';

@Controller('paymembercheck')
export class PaymembercheckController {
  constructor(private readonly paymembercheckService: PaymembercheckService) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(201)
  async checkandPostBankServer(@Req() req: IRequest, @Body() checkData: PaymemberCheckDto): Promise<IMessage> {
    const { id } = req.user;
    const responseFromBankServer = await this.paymembercheckService.checkandPostBankServer(id, checkData);
    return responseFromBankServer;
  }

  @Post('verify')
  @UseGuards(AuthGuard)
  @HttpCode(201)
  async verify(@Body() verifyData: PayverifyDto): Promise<IMessage> {
    const responseFromBankServer = await this.paymembercheckService.verify(verifyData);
    return responseFromBankServer;
  }

  @Post('account')
  @UseGuards(AuthGuard)
  @HttpCode(201)
  async accountCheck(@Body() accountCheckData: PayAccountCheckDto) {
    const responseFromBankServer = await this.paymembercheckService.accountCheck(accountCheckData);
    return responseFromBankServer;
  }

  @Post('transfer')
  @UseGuards(AuthGuard)
  @HttpCode(201)
  async transfer(@Body() transferData: transferDto) {
    const responseFromBankServer = await this.paymembercheckService.transfer(transferData);
    return responseFromBankServer;
  }
}
