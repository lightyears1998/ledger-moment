import {
  Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn
} from "typeorm";
import {
  Field, ID, ObjectType
} from "type-graphql";

import { Ledger } from "./Ledger";
import { Role } from "./Role";

@ObjectType()
@Entity()
@Unique("UNIQUE_username", ["username"])
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn("increment")
  userId!: number

  @ManyToMany(() => Role)
  @JoinTable()
  roles!: Role[]

  @Field()
  @Column()
  username!: string

  @Column()
  passwordHash!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @Field(() => [Ledger])
  @OneToMany(() => Ledger, ledger => ledger.owner)
  ledgers!: Ledger[]

  @Field(() => [Ledger])
  @ManyToMany(() => Ledger)
  @JoinTable()
  sharedLedgers!: Ledger[]
}
