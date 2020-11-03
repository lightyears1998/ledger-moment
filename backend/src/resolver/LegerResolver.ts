import {
  Query, Resolver, Ctx
} from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

import { AppContext } from "../context";
import { Ledger } from "../entity";
import { LedgerRepository } from "../repo/LegerRepository";

@Service()
@Resolver()
export class LegerResolver {
  @InjectRepository()
  private readonly ledgerRepository!: LedgerRepository

  @Query(() => [Ledger])
  async ledgers(@Ctx() ctx: AppContext): Promise<Ledger[]> {
    // TODO 在 state 中存放状态。
    if (ctx.state.user) {
      return [];
    }
  }
}
