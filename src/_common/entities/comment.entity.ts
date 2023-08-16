import { Document } from 'src/_common/entities/document.entity';
import { Member } from 'src/_common/entities/member.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Member, (member) => member.comments, {
    nullable: false,
  })
  member: Member;

  @ManyToOne(() => Document, (document) => document.comments, {
    nullable: false,
  })
  document: Document;
}
