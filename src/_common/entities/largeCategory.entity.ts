import { MiddleCategory } from 'src/_common/entities/middleCategory.entity';
import { Product } from 'src/_common/entities/product.entity';
import { SmallCategory } from 'src/_common/entities/smallCategory.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class LargeCategory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @OneToMany(() => MiddleCategory, (middleCategory) => middleCategory.largeCategory)
  middleCategories: LargeCategory[];

  @OneToMany(() => Product, (product) => product.largeCategory)
  products: Product[];

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
