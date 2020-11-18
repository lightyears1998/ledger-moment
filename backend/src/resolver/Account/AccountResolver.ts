import {
  Arg, Authorized, Ctx, Mutation, Query, Resolver
} from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { AppUserContext } from "../../context";
import { Account } from "../../entity";
import { AccountRepository } from "../../repo";
import { LedgerRepository } from "../../repo";

import { AddAccountInput } from "./AddAccountInput";

@Resolver(() => Account)
export class AccountResolver {
  @InjectRepository()
  ledgerRepository!: LedgerRepository

  @InjectRepository()
  accountRepository!: AccountRepository

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
