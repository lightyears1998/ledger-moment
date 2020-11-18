import {
  Field, Float, ObjectType
} from "type-graphql";
import {
  ChildEntity, Column, ManyToOne
} from "typeorm";

import { Account } from "..";

import { Record } from "./Record";
import { RecordType } from "./RecordType";

@ObjectType()
@ChildEntity(RecordType.TRANSFER_IN)
export class TransferInRecord extends Record {
  @ManyToOne(() => Account)
  @Field(() => Account)
  fromAccount!: Account

  @Column()
  @Field(() => Float)
  transfer!: number
}
