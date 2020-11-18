import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import {
  Account, Ledger, Record
} from "../entity";
import { AddAccountInput } from "../resolver";

import { LedgerRepository } from "./LegerRepository";

@Service()
@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {
  @InjectRepository()
  private readonly ledgerRepository!: LedgerRepository

  async findById(accountId: string): Promise<Account | undefined> {
    return this.findOne({ where: { accountId } });
  }

  async findByLedgerId(ledgerId: string): Promise<Account[]> {
    return this.find({ where: { ledger: { ledgerId } } });
  }

  async getLedger(account: Account): Promise<Ledger> {
    if (!account.ledger) {
      account.ledger = await this.createQueryBuilder().relation(Account, "ledger").of(account).loadOne() as Ledger;
    }

    return account.ledger;
  }

  async getRecords(account: Account): Promise<Array<Record>> {
    if (!account.records) {
      account.records = await this.createQueryBuilder().relation(Account, "records").of(account).loadMany();
    }

    return account.records;
  }

  async addAccount(ledger: Ledger, addAccountInput: AddAccountInput): Promise<Account> {
    const account = this.create({
      ledger,
      ...addAccountInput
    });

    return this.save(account);
  }
}
