import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Transaction } from "../../transactions/entities/transaction.entity";
import { FamilyMember } from "./family-member.entity";

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

  @OneToMany(
    () => FamilyMember,
    (familyMember) => familyMember.family
  )
  members: FamilyMember[];

  @OneToMany(
    () => Transaction,
    (transaction) => transaction.family
  )
  transactions: Transaction[];
}
