import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { MainDocumentService } from './main-document.service';
import { CreateDocumentDto } from '../_common/dtos/create-document.dto';
import { UpdateDocumentDto } from '../_common/dtos/update-document.dto';
import { IMessage } from '../_common/interfaces/message.interface';
import { Document } from '../_common/entities';
import { IRequest } from 'src/_common/interfaces/request.interface';
import { AuthGuard } from 'src/_common/guards/auth.guard';

@Controller('documents')
export class MainDocumentController {
  constructor(private documentService: MainDocumentService) {}
  // 게시물 작성
  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(201)
  async createDocument(@Body() documentData: CreateDocumentDto, @Req() req: IRequest): Promise<IMessage> {
    const { id } = req.user;
    return await this.documentService.createDocument(documentData, id);
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
    return await this.documentService.getOneDocument(id);
  }
  // 게시물 수정
  @Patch('edit/:id')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async updateDocument(@Param('id') docId: number, @Body() data: UpdateDocumentDto, @Req() req: IRequest): Promise<IMessage> {
    const { id } = req.user;
    return this.documentService.updateDocument(docId, data, id);
  }
  // 게시물 삭제
  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async deleteDocument(@Param('id') docId: number, @Req() req: IRequest): Promise<IMessage> {
    const { id } = req.user;
    return this.documentService.deleteDocument(docId, id);
  }
}
