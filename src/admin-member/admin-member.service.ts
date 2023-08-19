import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../_common/entities';

@Injectable()
export class AdminMemberService {
  constructor(@InjectRepository(Member) private membersRepository: Repository<Member>) {}
}
