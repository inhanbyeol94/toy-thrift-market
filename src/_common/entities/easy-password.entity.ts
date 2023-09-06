import { Member } from 'src/_common/entities';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class EasyPassword {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  bankAccountNumber: string;

  @Column()
  easyPassword: string;

  @Column({ nullable: false })
  memberId: number;

  @ManyToOne(() => Member, (member) => member.products, {
    nullable: false,
  })
  member: Member;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
