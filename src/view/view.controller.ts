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

  @Get('admins/category')
  @Render('admin/category-manage.ejs')
  category(): IView {
    return { title: '관리자', subtitle: '카테고리 관리' };
  }

  @Get('admins/category/add')
  @Render('admin/category-add.ejs')
  categoryAdd(): IView {
    return { title: '관리자', subtitle: '카테고리 추가' };
  }

  @Get('admins/category/edit')
  @Render('admin/category-edit.ejs')
  categoryEdit(): IView {
    return { title: '관리자', subtitle: '카테고리 수정' };
  }

  @Get('admins/category/delete')
  @Render('admin/category-delete.ejs')
  categoryDelete(): IView {
    return { title: '관리자', subtitle: '카테고리 삭제' };
  }

  // 회원관리 => 회원을 member로 지칭
  @Get('admins/member/add')
  @Render('admin/member-add.ejs')
  memberAdd(): IView {
    return { title: '관리자', subtitle: '회원 추가' };
  }

  @Get('admins/member/edit')
  @Render('admin/member-edit.ejs')
  memberEdit(): IView {
    return { title: '관리자', subtitle: '회원 수정' };
  }

  @Get('admins/member/delete')
  @Render('admin/member-delete.ejs')
  memberDelete(): IView {
    return { title: '관리자', subtitle: '회원 삭제' };
  }

  @Get('members/mypage')
  @Render('main/mypage.ejs')
  memberGet(): IView {
    return { title: '멤버', subtitle: '회원 정보' };
  }
}
