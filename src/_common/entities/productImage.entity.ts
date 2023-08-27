import { Product } from 'src/_common/entities/product.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  imageUrl: string;

  @Column()
  position: number;

  @ManyToOne(() => Product, (product) => product.productImages, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
