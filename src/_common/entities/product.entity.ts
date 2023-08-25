import { Member } from 'src/_common/entities/member.entity';
import { Pick } from 'src/_common/entities/pick.entity';
import { ProductImage } from 'src/_common/entities/productImage.entity';
import { Trade } from 'src/_common/entities/trade.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { SmallCategory } from './smallCategory.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column({ default: 1 })
  productStatus: number;

  @Column()
  price: number;

  @Column()
  content: string;

  @Column()
  count: number;

  @Column({ nullable: false })
  member_id: number;

  @Column({ nullable: false })
  small_Category_id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Pick, (pick) => pick.product)
  picks: Pick[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product, { eager: true, cascade: true })
  productImages: Product[];

  @ManyToOne(() => SmallCategory, (smallCategory) => smallCategory.products, {
    nullable: false,
  })
  smallCategory: SmallCategory;

  @ManyToOne(() => Member, (member) => member.products, {
    nullable: false,
  })
  member: Member;

  @OneToMany(() => Trade, (trade) => trade.product)
  trades: Trade[];
}
