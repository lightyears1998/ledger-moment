import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Account, Ledger } from "../entity";
import { AddAccountInput } from "../resolver";

import { LedgerRepository } from "./LegerRepository";

@Service()
@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {
  @InjectRepository()
  private readonly ledgerRepository!: LedgerRepository

  async findByLedgerId(ledgerId: string): Promise<Account[]> {
    return this.find({ where: { ledger: { ledgerId } } });
  }

  async addAccount(ledger: Ledger, addAccountInput: AddAccountInput): Promise<Account> {
    const account = this.create({
      ledger,
      ...addAccountInput
    });

    return this.save(account);
  }
}
