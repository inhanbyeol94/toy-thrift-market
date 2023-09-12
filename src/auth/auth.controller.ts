import { Controller, Post, Body, Res, Delete, Get, UseGuards, Req } from '@nestjs/common';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { AuthService } from './auth.service';
import { AuthDto } from '../_common/dtos/auth.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

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

  @Get('google/login') // 구글 로그인으로 이동하는 라우터 메서드
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('oauth2/redirect/google')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const token = await this.loginService.googleLogin(req);
    res.cookie('access_token', token.access_token, { httpOnly: true });
    res.redirect('/');
  }
}
