import { IsBoolean, IsNotEmpty } from 'class-validator';
import { CreateMemberDto } from 'src/_common/dtos/members.dto';

export class AddMemberDto extends CreateMemberDto {
  @IsBoolean()
  @IsNotEmpty()
  isAdmin: boolean;
}
