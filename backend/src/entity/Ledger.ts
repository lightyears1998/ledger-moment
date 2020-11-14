import {
  Field, ID, ObjectType
} from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";

import { User } from ".";


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
  @CreateDateColumn()
  createdAt!: Date

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date
}
