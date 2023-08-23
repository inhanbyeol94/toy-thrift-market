import { Controller, Post, Body, Res } from '@nestjs/common';
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
}
