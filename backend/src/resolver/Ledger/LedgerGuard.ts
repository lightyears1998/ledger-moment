import { ApolloError } from "apollo-server";
import {
  MiddlewareFn, NextFn, ResolverData
} from "type-graphql";
import { getCustomRepository } from "typeorm";

import { AppUserContext } from "../../context";
import { Ledger } from "../../entity";
import { LedgerRepository } from "../../repo";

export interface ContextAfterLedgerBelongsToContextUserGuard {
  state: { ledger: Ledger }
}

export function LedgerBelongsToContextUserGuard(ledgerIdArgName = "ledgerId"): MiddlewareFn<AppUserContext> {
  return async ({ context, args } : ResolverData<AppUserContext>, next: NextFn) => {
    const user = context.getSessionUser();
    const ledgerId = String(args[ledgerIdArgName]);

    const ledger = await getCustomRepository(LedgerRepository).findOneOrFail({ where: { ledgerId }, relations: ["owner"] });
    if (ledger.owner.userId !== user?.userId) {
      throw new ApolloError("该 Ledger 不属于当前 User。");
    }

    context.state.ledger = ledger;
    return next();
  };
}
