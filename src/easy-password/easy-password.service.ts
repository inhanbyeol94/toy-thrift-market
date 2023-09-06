import { Injectable } from '@nestjs/common';
import { CreateEasyPasswordDto } from '../_common/dtos/create-easy-password.dto';
import { UpdateEasyPasswordDto } from 'src/_common/dtos/update-easy-password.dto';
import { EasyPassword } from 'src/_common/entities/easy-password.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IMessage } from 'src/_common/interfaces/message.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EasyPasswordService {
  constructor(@InjectRepository(EasyPassword) private easyPwdRepository: Repository<EasyPassword>) {}

  async create(data: CreateEasyPasswordDto, memberId: number): Promise<IMessage> {
    const { bankAccountNumber, easyPassword } = data;
    const hashedEasyPwd = await bcrypt.hash(easyPassword, 10);

    const newEasyPwd = this.easyPwdRepository.create({
      bankAccountNumber,
      easyPassword: hashedEasyPwd,
      memberId,
    });
    await this.easyPwdRepository.save(newEasyPwd);

    return { message: '간편비밀번호가 설정되었습니다.' };
  }

  async findAllByMemberId(memberId) {
    const accounts = await this.easyPwdRepository.find({ where: { memberId }, select: { bankAccountNumber: true } });
    return accounts;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} easyPassword`;
  // }

  // update(id: number, updateEasyPasswordDto: UpdateEasyPasswordDto) {
  //   return `This action updates a #${id} easyPassword`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} easyPassword`;
  // }
}
