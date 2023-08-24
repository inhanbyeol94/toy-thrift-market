import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IRequest } from '../interfaces/request.interface';
import { NextFunction, Response } from 'express';

@Injectable()
export class TokenValidMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  async use(req: IRequest, res: Response, next: NextFunction) {
    const requestAccessToken = req.cookies.access_token;

    if (requestAccessToken) {
      try {
        req.user = this.jwtService.verify(requestAccessToken, { secret: process.env.ACCESS_SECRET_KEY });
        // console.log(req.user);
        return next();
      } catch (error) {
        res.clearCookie('access_token');
        return next();
      }
    }

    return next();
  }
}
