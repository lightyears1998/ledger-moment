import {
  Query, Resolver, Ctx, Arg, Mutation, Authorized, FieldResolver, ResolverInterface, Root, ID
} from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

import { AppUserContext } from "../../context";
import {
  Account, Ledger, User
} from "../../entity";
import { LedgerRepository } from "../../repo/LegerRepository";

@Service()
@Resolver(() => Ledger)
export class LegerResolver implements ResolverInterface<Ledger> {
  @InjectRepository()
  private readonly ledgerRepository!: LedgerRepository

  @FieldResolver()
  async owner(
    @Root() ledger: Ledger
  ): Promise<User> {
    return this.ledgerRepository.getOwner(ledger);
  }

  @FieldResolver()
  async accounts(@Root() ledger: Ledger): Promise<Account[]> {
    return this.ledgerRepository.getAccounts(ledger);
  }

  @Authorized()
  @Query(() => [Ledger])
  async ledgers(@Ctx() ctx: AppUserContext): Promise<Ledger[]> {
    return this.ledgerRepository.find({ owner: ctx.getSessionUser() });
  }

  @Authorized()
  @Mutation(() => Ledger)
  async addLedger(@Ctx() ctx: AppUserContext, @Arg("name") name: string): Promise<Ledger> {
    return this.ledgerRepository.save(this.ledgerRepository.create({ owner: ctx.getSessionUser(), name }));
  }

  @Authorized()
  @Mutation(() => Boolean)
  async shareLedger(): Promise<boolean> {
    throw new Error("todo");
  }

  @Authorized()
  @Mutation(() => [ID])
  async removeLedgersByName(@Ctx() ctx: AppUserContext, @Arg("name") name: string): Promise<string[]> {
    const ledgers = await this.ledgerRepository.find({ where: { owner: ctx.getSessionUser(), name } });
    const removedLedgers = (await this.ledgerRepository.remove(ledgers));
    return removedLedgers.map(ledger => ledger.ledgerId);
  }

  @Authorized()
  @Mutation(() => Boolean)
  async removeLedgerByID(@Ctx() ctx:AppUserContext, @Arg("id") ledgerId: string): Promise<boolean> {
    const ledger = await this.ledgerRepository.findOne({ where: { owner: ctx.getSessionUser(), ledgerId: ledgerId } });
    if (!ledger) {
      return false;
    }

    await this.ledgerRepository.remove(ledger);
    return true;
  }
}
