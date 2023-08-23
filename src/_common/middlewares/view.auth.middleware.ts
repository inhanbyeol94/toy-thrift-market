import { Injectable, NestMiddleware } from '@nestjs/common';
import { IRequest } from '../interfaces/request.interface';
import { NextFunction, Response } from 'express';

@Injectable()
export class ViewAuthMiddleware implements NestMiddleware {
  async use(req: IRequest, res: Response, next: NextFunction) {
    if (!req.user) return res.redirect('/login');
    return next();
  }
}
