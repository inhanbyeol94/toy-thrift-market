import { Board } from 'src/_common/entities/board.entity';
import { Comment } from 'src/_common/entities/comment.entity';
import { Member } from 'src/_common/entities/member.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  isSecret: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Member, (member) => member.documents, {
    nullable: false,
  })
  member: Member;

  @ManyToOne(() => Board, (board) => board.documents, {
    nullable: false,
  })
  board: Board;

  @OneToMany(() => Comment, (comment) => comment.document)
  comments: Comment[];
}
