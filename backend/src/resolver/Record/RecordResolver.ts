import {
  Args, Authorized, Ctx, Mutation, Query, Resolver, UseMiddleware
} from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { ContextAfterLedgerBelongsToContextUserGuard, LedgerBelongsToContextUserGuard } from "../Ledger/LedgerGuard";
import { Record, SetBalanceRecord } from "../../entity";
import { AccountRepository, LedgerRepository } from "../../repo";
import { RecordRepository } from "../../repo/RecordRepository";
import {
  AccountAccessibleByContextUserGuard, AccountExistsGuard, AccountExistsGuardContext
} from "../Account/AccountGuard";

import {
  AddSetBalanceRecordArgs, GetRecordsOfAccountArgs, GetRecordsOfLedgerArgs
} from "./ArgsType";

@Resolver(() => Record)
export class RecordResolver {
  @InjectRepository()
  accountRepository!: AccountRepository

  @InjectRepository()
  ledgerRepository!: LedgerRepository

  @InjectRepository()
  recordRepository!: RecordRepository

  @Authorized()
  @UseMiddleware([AccountExistsGuard("accountId", "account"), AccountAccessibleByContextUserGuard("account")])
  @Query(() => [Record])
  async recordsOfAccount(@Ctx() ctx: AccountExistsGuardContext, @Args() {}: GetRecordsOfAccountArgs): Promise<Record[]> {
    const account = ctx.state.account;
    return this.recordRepository.findByAccount(account);
  }

  @Authorized()
  @UseMiddleware(LedgerBelongsToContextUserGuard())
  @Query(() => [Record])
  async recordsOfLedger(@Ctx() ctx: ContextAfterLedgerBelongsToContextUserGuard, @Args() {}: GetRecordsOfLedgerArgs): Promise<Record[]> {
    const ledger = ctx.state.ledger;
    return this.recordRepository.findByLedger(ledger);
  }

  @Authorized()
  @Mutation(() => SetBalanceRecord)
  async addSetBalanceRecord(@Ctx() ctx: unknown, @Args() { accountId, balance }: AddSetBalanceRecordArgs): Promise<SetBalanceRecord> {
    console.log(ctx, accountId, balance);
    throw new Error("!!");
  }
}
