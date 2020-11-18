import { Field, InputType } from "type-graphql";

import { Account } from "../../entity";

@InputType()
export class AddAccountInput implements Partial<Account> {
  @Field()
  name!: string;

  @Field({ nullable: true })
  remark?: string;

  @Field({ nullable: true, defaultValue: 0 })
  balance!: number;
}
