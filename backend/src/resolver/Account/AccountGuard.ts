import { ApolloError } from "apollo-server";
import {
  MiddlewareFn, NextFn, ResolverData
} from "type-graphql";
import { getCustomRepository } from "typeorm";

import { AppUserContext } from "../../context";
import { Account } from "../../entity";
import { AccountRepository, LedgerRepository } from "../../repo";

export interface AccountExistsGuardContext<AccountStateKeyname extends string = "account"> {
  state: { [keyname in AccountStateKeyname]: Account }
}

export function AccountExistsGuard<AccountStateKeyname extends string, Context extends AccountExistsGuardContext<AccountStateKeyname> = AccountExistsGuardContext<AccountStateKeyname>>(accountIdArgName: string, stateKeyName: AccountStateKeyname): MiddlewareFn<Context> {
  return async ({ context, args }: ResolverData<Context>, next: NextFn) => {
    const accountId = String(args[accountIdArgName]);
    const account = await getCustomRepository(AccountRepository).findOne({ accountId });
    if (!account) {
      throw new ApolloError("Account 不存在。");
    }

    context.state[stateKeyName] = account;
    return next();
  };
}

export function AccountAccessibleByContextUserGuard<StateKeyName extends string, Context extends AppUserContext & AccountExistsGuardContext<StateKeyName>>(stateKeyName: StateKeyName): MiddlewareFn<Context> {
  return async ({ context } : ResolverData<Context>, next: NextFn) => {
    const user = context.getSessionUser();
    const account = context.state[stateKeyName] as Account;

    await getCustomRepository(AccountRepository).getLedger(account);
    await getCustomRepository(LedgerRepository).getOwner(account.ledger);

    if (account.ledger.owner.userId !== user?.userId) {
      throw new ApolloError("当前 User 不可访问该 Account。");
    }

    return next();
  };
}
