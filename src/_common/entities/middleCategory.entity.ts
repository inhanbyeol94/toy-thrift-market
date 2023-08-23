import { LargeCategory } from 'src/_common/entities/largeCategory.entity';
import { SmallCategory } from 'src/_common/entities/smallCategory.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class MiddleCategory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => LargeCategory, (largeCategory) => largeCategory.middleCategories, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  largeCategory: number;

  @OneToMany(() => SmallCategory, (smallCategory) => smallCategory.middleCategory)
  smallCategories: SmallCategory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
