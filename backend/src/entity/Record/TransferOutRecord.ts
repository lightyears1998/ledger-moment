import { Field, ObjectType } from "type-graphql";
import {
  ChildEntity, Column, ManyToOne
} from "typeorm";

import { Account } from "../Account";

import { Record } from "./Record";
import { RecordType } from "./RecordType";

@ObjectType()
@ChildEntity(RecordType.TRANSFER_OUT)
export class TransferOutRecord extends Record {
  @ManyToOne(() => Account)
  @Field(() => Account)
  toAccount!: Account

  @Field()
  @Column()
  transfer!: number
}
