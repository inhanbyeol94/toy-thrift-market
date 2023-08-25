import { Injectable, NestMiddleware } from '@nestjs/common';
import { IRequest } from '../interfaces/request.interface';
import { NextFunction, Response } from 'express';

@Injectable()
export class ViewAdminMiddleware implements NestMiddleware {
  async use(req: IRequest, res: Response, next: NextFunction) {
    if (!req.user) return res.redirect('/login');
    if (!req.user.isAdmin) return res.render('main/403', { title: '나중애', subtitle: '접근 제한', isLogin: false });
    return next();
  }
}
