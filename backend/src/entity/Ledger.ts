import {
  Field, ID, ObjectType
} from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";

import { Account, User } from ".";

@Entity()
@ObjectType()
export class Ledger {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  ledgerId!: string

  @Field(() => User)
  @ManyToOne(() => User, user => user.ledgers)
  owner!: User

  @Field()
  @Column()
  name!: string

  @Field()
  @Column({ default: "" })
  remark!: string

  @Field(() => [Account])
  @OneToMany(() => Account, account => account.ledger)
  accounts!: Account[]

  @Field()
  @CreateDateColumn()
  createdAt!: Date

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date
}
