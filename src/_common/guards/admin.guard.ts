import { CanActivate, Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.user) throw new UnauthorizedException('로그인이 필요합니다.');
    if (!request.user.isAdmin) throw new UnauthorizedException('권한이 없습니다.');

    return true;
  }
}
