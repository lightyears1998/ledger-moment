import {
  Query, Resolver, Ctx, Arg, Mutation, Authorized, FieldResolver, ResolverInterface, Root, ID
} from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

import { AppUserContext } from "../context";
import { Ledger, User } from "../entity";
import { LedgerRepository } from "../repo/LegerRepository";


@Service()
@Resolver(() => Ledger)
export class LegerResolver implements ResolverInterface<Ledger> {
  @InjectRepository()
  private readonly ledgerRepository!: LedgerRepository

  @FieldResolver()
  async owner(
    @Root() ledger: Ledger
  ): Promise<User> {
    return this.ledgerRepository.createQueryBuilder().relation(Ledger, "owner").of(ledger).loadOne<User>() as Promise<User>;
  }

  @Authorized()
  @Query(() => [Ledger])
  async ledgers(@Ctx() ctx: AppUserContext): Promise<Ledger[]> {
    return this.ledgerRepository.find({ owner: { userId: ctx.state.userId } });
  }

  @Authorized()
  @Mutation(() => Ledger)
  async addLedger(@Ctx() ctx: AppUserContext, @Arg("name") name: string): Promise<Ledger> {
    return this.ledgerRepository.save(this.ledgerRepository.create({ owner: { userId: ctx.state.userId }, name }));
  }

  @Authorized()
  @Mutation(() => ID)
  async removeLedgerByName(@Ctx() ctx: AppUserContext, @Arg("name") name: string): Promise<number> {
    const ledgers = this.ledgerRepository.find({ where: { owner: ctx.getSessionUser() } });
    this.ledgerRepository.softRemove();
  }
}
