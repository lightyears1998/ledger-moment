import {
  ArgsType, Field, ID
} from "type-graphql";

@ArgsType()
export class GetRecordsOfAccountArgs {
  @Field(() => ID)
  accountId!: string
}
