import { Field, ObjectType } from "type-graphql";
import { ChildEntity, Column } from "typeorm";

import { Record } from "./Record";
import { RecordType } from "./RecordType";

@ObjectType()
@ChildEntity(RecordType.INCOME)
export class IncomeRecord extends Record {
  @Column()
  @Field()
  income!: number
}
