import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Chat } from './chat.entity';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  buyerId: number;

  @Column()
  sellerId: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Chat, (chat) => chat.chatroom, { cascade: true })
  chats: Chat[];
}
