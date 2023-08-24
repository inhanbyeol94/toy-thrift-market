import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { MainDocumentService } from './main-document.service';
import { CreateDocumentDto } from '../_common/dtos/create-document.dto';
import { UpdateDocumentDto } from '../_common/dtos/update-document.dto';
import { IMessage } from '../_common/interfaces/message.interface';
import { Document } from '../_common/entities';
// import { sendSlackMessage } from '../slack';

@Controller('documents')
export class MainDocumentController {
  constructor(private documentService: MainDocumentService) {}
  // 게시물 작성
  @Post()
  @HttpCode(201)
  async createDocument(@Body() documentData: CreateDocumentDto): Promise<IMessage> {
    // const response = await this.documentService.createDocument(documentData);
    return await this.documentService.createDocument(documentData);

    // // 성공적으로 게시글이 작성되면 슬랙 메시지를 보냅니다.
    // if (response.message === '게시물이 작성되었습니다.') {
    //   const slackMessage = `${documentData.boardId}번 게시판에 새로운 게시물이 등록되었습니다: ${documentData.title}`;
    //   sendSlackMessage(slackMessage);
    // }

    // return response;
  }
  // 게시물 목록조회
  @Get(':boardId')
  @HttpCode(200)
  async getDocuments(@Param('boardId') boardId: number): Promise<Document[]> {
    return this.documentService.getDocuments(boardId);
  }
  // 게시물 상세조회
  @Get('detail/:id')
  @HttpCode(200)
  async getOneDocument(@Param('id') id: number): Promise<Document> {
    console.log(id);
    return await this.documentService.getOneDocument(id);
  }
  // 게시물 수정
  @Patch('edit/:id')
  @HttpCode(200)
  async updateDocument(@Param('id') id: number, @Body() data: UpdateDocumentDto): Promise<IMessage> {
    return this.documentService.updateDocument(id, data);
  }
  // 게시물 삭제
  @Delete(':id')
  @HttpCode(200)
  async deleteDocument(@Param('id') id: number): Promise<IMessage> {
    return this.documentService.deleteDocument(id);
  }
}
