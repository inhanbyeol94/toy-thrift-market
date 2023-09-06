import { Member } from 'src/_common/entities/member.entity';
import { Product } from 'src/_common/entities/product.entity';
import { Review } from 'src/_common/entities/review.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Trade {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Review, (review) => review.trade)
  review: Review;

  @ManyToOne(() => Product, (product) => product.trades, {
    nullable: false,
  })
  product: Product;

  @ManyToOne(() => Member, (member) => member.trades, {
    nullable: false,
  })
  member: Member;

  @Column()
  buyerAccountNumber: string;
}
