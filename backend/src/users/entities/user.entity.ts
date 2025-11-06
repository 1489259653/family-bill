import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FamilyMember } from "../../families/entities/family-member.entity";
import { Transaction } from "../../transactions/entities/transaction.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => Transaction,
    (transaction) => transaction.user
  )
  transactions: Transaction[];

  @OneToMany(
    () => FamilyMember,
    (familyMember) => familyMember.user
  )
  familyMembers: FamilyMember[];
}
