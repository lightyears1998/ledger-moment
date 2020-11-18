import { Field, ObjectType } from "type-graphql";
import {
  CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn
} from "typeorm";

import { Account } from "../Account";
import { Ledger } from "../Ledger";

@ObjectType()
@Entity()
@TableInheritance({ column: { type: "int", name: "type" } })
export class Record {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  recordId!: string

  @ManyToOne(() => Ledger)
  ledger!: Ledger

  @ManyToOne(() => Account)
  account!: Account

  @Field({ defaultValue: "" })
  remark!: string

  @Field()
  @CreateDateColumn()
  createdAt!: Date

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date
}
