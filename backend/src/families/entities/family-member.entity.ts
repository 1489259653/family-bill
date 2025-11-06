import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Family } from "./family.entity";

export enum FamilyRole {
  ADMIN = "admin",
  MEMBER = "member",
}

@Entity()
export class FamilyMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => User,
    (user) => user.id
  )
  user: User;

  @ManyToOne(
    () => Family,
    (family) => family.members
  )
  family: Family;

  @Column({ type: "enum", enum: FamilyRole, default: FamilyRole.MEMBER })
  role: FamilyRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  joinedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
