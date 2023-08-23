import { HttpException, NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from '../_common/entities';
import { BoardDto } from '../_common/dtos/boards.dto';
import { IMessage } from '../_common/interfaces/message.interface';

@Injectable()
export class AdminBoardService {
  constructor(@InjectRepository(Board) private boardsRepository: Repository<Board>) {}

  // 게시판 추가
  async createBoard(createBoardData: BoardDto): Promise<IMessage> {
    const { name } = createBoardData;

    const existingName = await this.boardsRepository.findOne({ where: { name } });
    if (existingName) throw new HttpException('이미 등록되어있는 게시판입니다.', 403);

    const documentAuthority = Boolean(createBoardData.documentAuthority);
    const commentAuthority = Boolean(createBoardData.commentAuthority);

    await this.boardsRepository.save({ name: createBoardData.name, documentAuthority: documentAuthority, commentAuthority: commentAuthority });
    return { message: '게시판을 추가하였습니다.' };
  }

  // 게시판 조회
  async findBoards(): Promise<Board[]> {
    return await this.boardsRepository.find();
  }

  // 게시판 수정
  async updateBoard(boadId: number, name: string, documentAuthority: boolean, commentAuthority: boolean): Promise<IMessage> {
    const board = await this.boardsRepository.findOne({ where: { id: boadId } });
    if (!board) {
      throw new NotFoundException('게시판이 존재하지 않습니다.');
    }
    board.name = name;
    board.documentAuthority = documentAuthority;
    board.commentAuthority = commentAuthority;
    await this.boardsRepository.save(board);
    return { message: '게시판 정보가 수정되었습니다.' };
  }

  // 게시판 삭제
  async deleteBoard(boardId: number): Promise<IMessage> {
    const board = await this.boardsRepository.findOne({ where: { id: boardId } });
    if (!board) {
      throw new NotFoundException('해당하는 게시판이 없습니다.');
    }
    await this.boardsRepository.softDelete(boardId);
    return { message: '게시판 삭제가 완료되었습니다.' };
  }
}
