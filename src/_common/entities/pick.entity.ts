import { Member } from 'src/_common/entities/member.entity';
import { Product } from 'src/_common/entities/product.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Pick {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false })
  member_id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Product, (product) => product.picks, {
    nullable: false,
  })
  product: Product;

  @ManyToOne(() => Member, (member) => member.picks, {
    nullable: false,
  })
  member: Member;
}
