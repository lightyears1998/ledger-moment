import { Field, ObjectType } from "type-graphql";
import { ChildEntity, Column } from "typeorm";

import { Record } from "./Record";
import { RecordType } from "./RecordType";

@ObjectType()
@ChildEntity(RecordType.EXPENSE)
export class ExpenseRecord extends Record {
  @Column()
  @Field()
  expanse!: number
}
