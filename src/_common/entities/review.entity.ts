import { Trade } from 'src/_common/entities/trade.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Trade, {
    nullable: false,
  })
  @JoinColumn()
  trade: Trade;
}
