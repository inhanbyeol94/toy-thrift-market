import { HttpException, NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../_common/entities';
import { IMessage } from 'src/_common/interfaces/message.interface';

@Injectable()
export class AdminMemberService {
  constructor(@InjectRepository(Member) private membersRepository: Repository<Member>) {}

  // async findAllMember(){}

  // async createMember(){}

  // async updateMember(){}

  async deleteMember(id: number): Promise<IMessage> {
    const existingMember = await this.membersRepository.findOne({
      where: { id },
    });

    if (!existingMember) {
      throw new NotFoundException('id와 일치하는 회원이 없습니다.');
    }
    await this.membersRepository.softDelete(id);
    return { message: '회원 삭제를 완료했습니다.' };
  }
}
