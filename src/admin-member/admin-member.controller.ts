import { Controller } from '@nestjs/common';
import { AdminMemberService } from './admin-member.service';

@Controller('members')
export class AdminMemberController {
  constructor(private adminMemberService: AdminMemberService) {}
}
