import { Comment } from 'src/_common/entities/comment.entity';
import { Document } from 'src/_common/entities/document.entity';
import { Pick } from 'src/_common/entities/pick.entity';
import { Product } from 'src/_common/entities/product.entity';
import { Trade } from 'src/_common/entities/trade.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EasyPassword } from './easy-password.entity';

@Entity()
export class Member {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  nickname: string;

  @Column()
  password: string;

  @Column()
  profileImage: string;

  @Column()
  tel: string;

  @Column()
  address: string;

  @Column()
  subAddress: string;

  @Column()
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Product, (product) => product.member)
  products: Product[];

  @OneToMany(() => Pick, (pick) => pick.member)
  picks: Pick[];

  @OneToMany(() => Trade, (trade) => trade.member)
  trades: Trade[];

  @OneToMany(() => Document, (document) => document.member, { cascade: true })
  documents: Document[];

  @OneToMany(() => Comment, (comment) => comment.member, { cascade: true })
  comments: Comment[];

  @OneToMany(() => EasyPassword, (easyPassword) => easyPassword.member)
  easyPasswords: EasyPassword[];
}
