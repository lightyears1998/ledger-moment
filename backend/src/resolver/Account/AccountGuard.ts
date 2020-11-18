import { ApolloError } from "apollo-server";
import {
  MiddlewareFn, NextFn, ResolverData
} from "type-graphql";
import { getCustomRepository } from "typeorm";

import { AppUserContext } from "../../context";
import { Account } from "../../entity";
import { AccountRepository } from "../../repo";

export interface ContextAfterAccountBelongsToContextUserGuard {
  state: { account: Account }
}

export function AccountBelongsToContextUserGuard(accountIdArgName = "accountId"): MiddlewareFn<AppUserContext> {
  return async ({ context, args } : ResolverData<AppUserContext>, next: NextFn) => {
    const user = context.getSessionUser();
    const accountId = String(args[accountIdArgName]);

    const account = await getCustomRepository(AccountRepository).findOneOrFail({ where: { accountId: accountId }, relations: ["ledger", "ledger.owner"] });
    if (account.ledger.owner.userId !== user?.userId) {
      throw new ApolloError("该 Account 不属于当前 User。");
    }

    context.state.account = account;
    return next();
  };
}
