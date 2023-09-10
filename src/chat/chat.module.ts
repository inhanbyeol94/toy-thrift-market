import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatBackEndGateway } from './chat.gateway';
import { ChatRoomService } from './chatRoom.service';
import { ChatService } from './chat.service';
import { Chat } from 'src/_common/entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat])],
  providers: [ChatBackEndGateway, ChatRoomService, ChatService],
  controllers: [],
})
export class ChatModule {}
