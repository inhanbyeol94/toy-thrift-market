import { MiddleCategory } from 'src/_common/entities/middleCategory.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class SmallCategory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Product, (product) => product.smallCategory)
  products: Product[];

  @ManyToOne(() => MiddleCategory, (middleCategory) => middleCategory.smallCategories, {
    nullable: false,
  })
  middleCategory: MiddleCategory;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
