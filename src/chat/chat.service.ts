import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../_common/entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  // async saveMessage(roomId: string, userId: string, nickname: string, message: string, timestamp: Date): Promise<Chat> {
  // const newMessage = this.chatRepository.create({
  //   roomId,
  //   userId,
  //   message,
  //   timestamp,
  // });
  // return this.chatRepository.save(newMessage);
  // }

  // async getMessages(roomId: string): Promise<Chat[]> {
  // return this.chatRepository.find({
  //   where: {
  //     roomId,
  //   },
  //   order: {
  //     timestamp: 'ASC',
  //   },
  // });
  // }

  // async createChat(senderId: number, receiverId: number, message: string): Promise<Chat> {
  //   const chat = new Chat();
  //   chat.senderId = senderId;
  //   chat.receiverId = receiverId;
  //   chat.message = message;
  //   chat.timestamp = new Date();

  //   return this.chatRepository.save(chat);
  // }

  // async getChats(senderId: number, receiverId: number): Promise<Chat[]> {
  //   return this.chatRepository.find({
  //     where: [
  //       { senderId, receiverId },
  //       { senderId: receiverId, receiverId: senderId },
  //     ],
  //     order: { timestamp: 'ASC' },
  //   });
  // }
}
