import { MiddleCategory } from 'src/_common/entities/middleCategory.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class SmallCategory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => MiddleCategory, (middleCategory) => middleCategory.smallCategories, {
    nullable: false,
  })
  middleCategory: MiddleCategory;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
