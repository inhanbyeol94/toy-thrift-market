import { Request } from 'express';

export interface IRequest extends Request {
  user?: { id: number; email: string; name: string; nickname: string; isAdmin: boolean; profileImage: string };
  files: any;
}
