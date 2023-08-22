import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDocumentDto } from '../_common/dtos/create-document.dto';
import { UpdateDocumentDto } from '../_common/dtos/update-document.dto';
import { Document, Board, Member } from 'src/_common/entities';
import { IMessage } from '../_common/interfaces/message.interface';

@Injectable()
export class MainDocumentService {
  constructor(
    @InjectRepository(Document) private documentRepository: Repository<Document>,
    @InjectRepository(Board) private boardRepository: Repository<Board>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {}
  // 게시물 작성
  async createDocument(documentData: CreateDocumentDto): Promise<IMessage> {
    const { title, content, isSecret, memberId, boardId } = documentData;
    const existingBoard = await this.boardRepository.findOne({ where: { id: boardId } });
    if (!existingBoard) {
      throw new HttpException('해당 보드가 존재하지 않습니다.', 404);
    }
    const exisingMember = await this.memberRepository.findOne({ where: { id: memberId } });
    if (!exisingMember) {
      throw new HttpException('해당 멤버가 존재하지 않습니다.', 404);
    }
    const newDocument = this.documentRepository.create({ title, content, isSecret, member: exisingMember, board: existingBoard });
    await this.documentRepository.save(newDocument);
    return { message: '게시글이 추가되었습니다.' };
  }
  // 게시물 목록조회
  async getDocuments(): Promise<Document[]> {
    return await this.documentRepository.find();
  }
  // 게시물 상세조회
  async getOneDocument(id: number): Promise<Document> {
    const document = await this.documentRepository.findOne({ where: { id } });
    if (!document) throw new HttpException('게시물을 찾지 못했습니다.', 404);
    return document;
  }
  // 게시물 수정
  async updateDocument(id: number, data: UpdateDocumentDto): Promise<IMessage> {
    const document = await this.documentRepository.findOne({ where: { id } });
    if (!document) {
      throw new NotFoundException('해당하는 게시물이 없습니다.');
    }
    document.title = data.title;
    document.content = data.content;
    await this.documentRepository.save(document);
    return { message: '게시물이 수정되었습니다.' };
  }
  // 게시물 삭제
  async deleteDocument(id: number): Promise<IMessage> {
    const document = this.documentRepository.findOne({ where: { id } });
    if (!document) {
      throw new NotFoundException('해당하는 게시물이 없습니다.');
    }
    await this.documentRepository.delete(id);
    return { message: '게시물이 삭제되었습니다. ' };
  }
}
