import { Controller, Get, Render, Res } from '@nestjs/common';
import { IView } from '../_common/interfaces/view.interface';

@Controller()
export class ViewController {
  @Get()
  @Render('main/index.ejs')
  index(): IView {
    return { title: '테스트', subtitle: '서브 테스트' };
  }

  @Get('login')
  @Render('main/login.ejs')
  login(): IView {
    return { title: '나중애', subtitle: '로그인' };
  }

  @Get('signup')
  @Render('main/signup.ejs')
  signup(): IView {
    return { title: '나중애', subtitle: '회원가입' };
  }

  @Get('admins')
  @Render('admin/index.ejs')
  admin(): IView {
    return { title: '나중애', subtitle: '관리자' };
  }
}
