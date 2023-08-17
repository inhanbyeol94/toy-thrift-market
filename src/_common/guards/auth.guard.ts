import { CanActivate, Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
// 가드는 인터페이스 CanActivate를 구현해야 한다.
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // HTTP 요청 객체에 접근한다.
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.access_token;
    // access_token: "eyJhbGciOiJI"
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const user = await this.jwtService.verify(token, { secret: process.env.ACCESS_SECRET_KEY });
      request.user = user;
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
