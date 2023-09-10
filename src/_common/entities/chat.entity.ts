import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { ChatRoom } from './chatroom.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomId: string;

  @Column()
  userId: string;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ChatRoom, (chatroom) => chatroom.chats, {
    onDelete: 'CASCADE',
    nullable: true,
    eager: true,
  })
  chatroom: ChatRoom;
}
