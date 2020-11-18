import {
  ArgsType, Field, ID
} from "type-graphql";

import { SetBalanceRecord } from "../../entity";

@ArgsType()
export class GetRecordsOfAccountArgs {
  @Field(() => ID)
  accountId!: string
}

@ArgsType()
export class GetRecordsOfLedgerArgs {
  @Field(() => ID)
  ledgerId!: string
}

@ArgsType()
export class AddSetBalanceRecordArgs implements Partial<SetBalanceRecord> {
  @Field(() => ID)
  accountId!: string

  @Field()
  balance!: number
}
