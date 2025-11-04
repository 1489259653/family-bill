import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { FamilyMember } from './family-member.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity()
export class Family {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  invitationCode: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => FamilyMember, familyMember => familyMember.family)
  members: FamilyMember[];

  @OneToMany(() => Transaction, transaction => transaction.family)
  transactions: Transaction[];
}