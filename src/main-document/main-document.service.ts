import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDocumentDto } from '../_common/dtos/create-document.dto';
import { UpdateDocumentDto } from '../_common/dtos/update-document.dto';
import { Document, Board, Member } from 'src/_common/entities';
import { IMessage } from '../_common/interfaces/message.interface';
import { SlackService } from '../slack/slack.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MainDocumentService {
  constructor(
    @InjectRepository(Document) private documentRepository: Repository<Document>,
    @InjectRepository(Board) private boardRepository: Repository<Board>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    private slackService: SlackService,
    private configService: ConfigService,
  ) {}
  // 게시물 작성
  async createDocument(documentData: CreateDocumentDto, id: number): Promise<IMessage> {
    const { title, content, isSecret, boardId } = documentData;
    const existingBoard = await this.boardRepository.findOne({ where: { id: boardId } });
    if (!existingBoard) throw new HttpException('해당 게시판이 존재하지 않습니다.', 404);
    const boardName = existingBoard.name;

    const exisingMember = await this.memberRepository.findOne({ where: { id } });
    if (!exisingMember) throw new HttpException('해당 멤버가 존재하지 않습니다.', 404);
    const writerNickname = exisingMember.nickname;

    const newDocument = this.documentRepository.create({ title, content, isSecret, member: exisingMember, board: existingBoard });
    await this.documentRepository.save(newDocument);

    if (boardName === '문의하기') {
      // 슬랙 메시지 보내기
      const port = this.configService.get<string>('HOST');
      const slackMessage = `${boardName}에 새로운 글이 등록되었습니다. \n - 제목: ${title} \n - 작성자: ${writerNickname} \n - URL: http://${port}/document?id=${newDocument.id}`;
      this.slackService.sendSlackMessage(slackMessage);
    }
    return { message: '게시물이 작성되었습니다.' };
  }
  // 게시물 목록조회
  async getDocuments(boardId: number): Promise<Document[]> {
    return await this.documentRepository.find({ where: { board: { id: boardId } } });
  }
  // 게시물 상세조회
  async getOneDocument(id: number): Promise<Document> {
    const document = await this.documentRepository.findOne({ where: { id: id } });
    if (!document) throw new HttpException('게시물을 찾지 못했습니다.', 404);
    return document;
  }
  // 게시물 수정
  async updateDocument(docId: number, data: UpdateDocumentDto, id: number): Promise<IMessage> {
    const document = await this.documentRepository.findOne({ where: { id: docId } });
    if (!document) throw new NotFoundException('해당하는 게시물이 없습니다.');
    if (id != document.member.id) throw new HttpException('작성자가 아닙니다.', 404);
    document.title = data.title;
    document.content = data.content;
    await this.documentRepository.save(document);
    return { message: '게시물이 수정되었습니다.' };
  }
  // 게시물 삭제
  async deleteDocument(docId: number, id: number): Promise<IMessage> {
    const document = await this.documentRepository.findOne({ where: { id: docId } });
    if (!document) throw new NotFoundException('해당하는 게시물이 없습니다.');
    if (id != document.member.id) throw new HttpException('작성자가 아닙니다.', 404);
    await this.documentRepository.softDelete(id);
    return { message: '게시물이 삭제되었습니다. ' };
  }
}
