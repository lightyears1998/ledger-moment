import {
  Field, Float, ObjectType
} from "type-graphql";
import {
  Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn
} from "typeorm";

import { Ledger } from "./Ledger";
import { Record } from "./Record";

@ObjectType()
@Entity()
export class Account {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  accountId!: string

  @ManyToOne(() => Ledger, ledger => ledger.accounts)
  ledger!: Ledger

  @Field()
  @Column()
  name!: string

  @Field()
  @Column()
  remark!: string

  @Field(() => Float)
  @Column()
  balance!: number

  @Field(() => [Record])
  @OneToMany(() => Record, record => record.account)
  records!: Record[]
}
