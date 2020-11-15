import { ObjectType } from "type-graphql";
import { ChildEntity } from "typeorm";

import { Record } from "./Record";


@ObjectType()
@ChildEntity()
export class IncomeRecord extends Record {
}
