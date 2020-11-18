import { Field, ObjectType } from "type-graphql";
import { ChildEntity, Column } from "typeorm";

import { Record } from "./Record";
import { RecordType } from "./RecordType";

@ObjectType()
@ChildEntity(RecordType.SET_BALANCE)
export class SetBalanceRecord extends Record {
  @Column()
  @Field()
  balance!: number
}
