import { Controller, Get, Render, Res, Query } from '@nestjs/common';
import { IRequest } from 'src/_common/interfaces/request.interface';
import { ViewService } from 'src/view/view.service';
import { IView } from '../_common/interfaces/view.interface';

@Controller()
export class ViewController {
  constructor(private viewService: ViewService) {}

  @Get()
  @Render('main/index.ejs')
  index(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애', '메인', payload);
  }

  @Get('login')
  @Render('main/login.ejs')
  login(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애', '로그인', payload);
  }

  @Get('signup')
  @Render('main/signup.ejs')
  signup(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애', '회원가입', payload);
  }

  @Get('admins')
  @Render('admin/index.ejs')
  admin(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애 관리자', '대시보드', payload);
  }

  @Get('admins/category')
  @Render('admin/category-manage.ejs')
  category(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애 관리자', '카테고리 관리', payload);
  }

  @Get('admins/category/add')
  @Render('admin/category-add.ejs')
  categoryAdd(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애', '카테고리 추가', payload);
  }

  @Get('admins/category/edit')
  @Render('admin/category-edit.ejs')
  categoryEdit(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애 관리자', '카테고리 수정', payload);
  }

  @Get('admins/category/delete')
  @Render('admin/category-delete.ejs')
  categoryDelete(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애 관리자', '카테고리 삭제', payload);
  }

  // 회원관리 => 회원을 member로 지칭
  @Get('admins/member/add')
  @Render('admin/member-add.ejs')
  memberAdd(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애 관리자', '회원 추가', payload);
  }

  @Get('admins/member/edit')
  @Render('admin/member-edit.ejs')
  memberEdit(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애 관리자', '회원 수정', payload);
  }

  @Get('admins/member/delete')
  @Render('admin/member-delete.ejs')
  memberDelete(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애 관리자', '회원 삭제', payload);
  }

  // 게시판 관리
  @Get('admins/board/manage')
  @Render('admin/board-manage.ejs')
  boardAdd(): IView {
    return { title: '관리자', subtitle: '게시판 추가' };
  }

  // 게시판
  @Get('board')
  @Render('main/board.ejs')
  loadBoard(@Query('boardId') boardId: number): IView {
    return { title: '나중애', subtitle: '게시판' };
  }

  // 게시물작성
  @Get('document-write')
  @Render('main/document-write.ejs')
  documentWrite(@Query('boardId') boardId: number): IView {
    return { title: '나중애', subtitle: '게시물작성' };
  }

  // 게시물 상세
  @Get('document')
  @Render('main/document-detail.ejs')
  documentDetail(@Query('id') id: number): IView {
    return { title: '나중애', subtitle: '게시물상세' };
  }
}
