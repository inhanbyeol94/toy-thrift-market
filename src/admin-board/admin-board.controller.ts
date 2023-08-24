import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminBoardService } from './admin-board.service';
import { IMessage } from '../_common/interfaces/message.interface';
import { BoardDto } from '../_common/dtos/boards.dto';
import { Board } from '../_common/entities';
import { AdminGuard } from 'src/_common/guards/admin.guard';

@Controller('admin-boards')
export class AdminBoardController {
  constructor(private adminBoardService: AdminBoardService) {}

  // 게시판 추가
  @Post()
  @UseGuards(AdminGuard)
  @HttpCode(200)
  async createBoard(@Body() createBoardData: BoardDto): Promise<IMessage> {
    return await this.adminBoardService.createBoard(createBoardData);
  }

  // 게시판 조회
  @Get()
  @HttpCode(200)
  async findBoards(): Promise<Board[]> {
    return await this.adminBoardService.findBoards();
  }

  // 게시판 수정
  @Patch('/:id')
  @UseGuards(AdminGuard)
  @HttpCode(200)
  async updateBoard(@Param('id') boadId: number, @Body() updateBoardData: BoardDto): Promise<IMessage> {
    return await this.adminBoardService.updateBoard(boadId, updateBoardData.name, updateBoardData.documentAuthority, updateBoardData.commentAuthority);
  }

  // 게시판 삭제
  @Delete('/:id')
  @UseGuards(AdminGuard)
  @HttpCode(200)
  async deleteBoard(@Param('id') boardId: number): Promise<IMessage> {
    return await this.adminBoardService.deleteBoard(boardId);
  }
}
