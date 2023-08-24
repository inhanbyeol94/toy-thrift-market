import { Controller, Post, Body, Res, Delete } from '@nestjs/common';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { AuthService } from './auth.service';
import { AuthDto } from '../_common/dtos/auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginService: AuthService) {}

  @Post('/login')
  async login(@Body() data: AuthDto, @Res() res: Response): Promise<Response> {
    const result = await this.loginService.login(data.email, data.password);

    res.cookie('access_token', result.access_token, { httpOnly: true });
    return res.status(200).json(true);
  }

  @Delete()
  async logout(@Res() res: Response): Promise<Response> {
    res.clearCookie('access_token');
    return res.status(200).json({ result: true });
  }
}
