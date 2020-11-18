import { ApolloError } from "apollo-server";
import {
  Arg, Args, Authorized, Ctx, ID, Query, Resolver, UseMiddleware
} from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { AppUserContext } from "../../context";
import { Record } from "../../entity";
import { AccountRepository, LedgerRepository } from "../../repo";
import { RecordRepository } from "../../repo/RecordRepository";
import { AccountBelongsToContextUserGuard, ContextAfterAccountBelongsToContextUserGuard } from "../Account/AccountGuard";

import { GetRecordsOfAccountArgs } from "./GetRecordsOfAccountArgs";

@Resolver(() => Record)
export class RecordResolver {
  @InjectRepository()
  accountRepository!: AccountRepository

  @InjectRepository()
  ledgerRepository!: LedgerRepository

  @InjectRepository()
  recordRepository!: RecordRepository

  @Authorized()
  @UseMiddleware(AccountBelongsToContextUserGuard("accountId"))
  @Query(() => [Record])
  async recordsOfAccount(@Ctx() ctx: ContextAfterAccountBelongsToContextUserGuard, @Args() {}: GetRecordsOfAccountArgs): Promise<Record[]> {
    const account = ctx.state.account;
    return this.recordRepository.findByAccount(account);
  }

  @Authorized()
  @Query(() => [Record])
  async recordsOfLedger(@Ctx() ctx: AppUserContext, @Arg("ledgerId", () => ID) ledgerId: string): Promise<Record[]> {
    const ledger = await this.ledgerRepository.findOneOrFail({ where: { ledgerId }, relations: ["owner"] });
    if (ledger.owner.userId !== ctx.getSessionUser()?.userId) {
      throw new ApolloError("该 Ledger 不属于当前用户。");
    }

    return this.recordRepository.findByLedger(ledger);
  }
}
