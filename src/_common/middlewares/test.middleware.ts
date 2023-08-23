import { Injectable, NestMiddleware } from '@nestjs/common';
import { IRequest } from '../interfaces/request.interface';
import { NextFunction, Response, Request } from 'express';

@Injectable()
export class TestMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: IRequest, res: Response, next: NextFunction) {
    return next();
  }
}
