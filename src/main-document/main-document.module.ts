import { Module } from '@nestjs/common';
import { MainDocumentController } from './main-document.controller';
import { MainDocumentService } from './main-document.service';
import { Board, Document, Member } from 'src/_common/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlackModule } from '../slack/slack.module';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Board, Document]), SlackModule],
  controllers: [MainDocumentController],
  providers: [MainDocumentService],
})
export class MainDocumentModule {}
