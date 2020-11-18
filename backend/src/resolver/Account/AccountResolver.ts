import {
  Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, ResolverInterface, Root
} from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { AppUserContext } from "../../context";
import { Account, Record } from "../../entity";
import { AccountRepository } from "../../repo";
import { LedgerRepository } from "../../repo";

import { AddAccountInput } from "./AddAccountInput";

@Resolver(() => Account)
export class AccountResolver implements ResolverInterface<Account> {
  @InjectRepository()
  ledgerRepository!: LedgerRepository

  @InjectRepository()
  accountRepository!: AccountRepository

  @FieldResolver()
  async records(@Root() account: Account): Promise<Array<Record>> {
    return this.accountRepository.getRecords(account);
  }

  @Authorized()
  @Query(() => [Account])
  async accounts(@Arg("ledgerId") ledgerId: string): Promise<Account[]> {
    return this.accountRepository.findByLedgerId(ledgerId);
  }

  @Authorized()
  @Mutation(() => Account)
  async addAccount(@Ctx() ctx: AppUserContext, @Arg("ledgerId") ledgerId: string, @Arg("account") account: AddAccountInput): Promise<Account> {
    const ledger = await this.ledgerRepository.findOneOrFail({ ledgerId, owner: ctx.getSessionUser() });
    return this.accountRepository.addAccount(ledger, account);
  }
}
