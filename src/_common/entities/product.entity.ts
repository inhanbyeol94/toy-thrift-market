import { LargeCategory } from 'src/_common/entities/largeCategory.entity';
import { Member } from 'src/_common/entities/member.entity';
import { Pick } from 'src/_common/entities/pick.entity';
import { ProductImage } from 'src/_common/entities/productImage.entity';
import { Trade } from 'src/_common/entities/trade.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column()
  productStatus: number;

  @Column()
  price: number;

  @Column()
  content: string;

  @Column()
  count: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Pick, (pick) => pick.product)
  picks: Pick[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product)
  productImages: Product[];

  @ManyToOne(() => LargeCategory, (largeCategory) => largeCategory.products, {
    nullable: false,
  })
  largeCategory: LargeCategory;

  @ManyToOne(() => Member, (member) => member.products, {
    nullable: false,
  })
  member: Member;

  @OneToMany(() => Trade, (trade) => trade.product)
  trades: Trade[];
}
