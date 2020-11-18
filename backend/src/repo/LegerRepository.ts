import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";

import {
  Account, Ledger, User
} from "../entity";

@Service()
@EntityRepository(Ledger)
export class LedgerRepository extends Repository<Ledger> {
  async getOwner(ledger: Ledger): Promise<User> {
    if (!ledger.owner) {
      ledger.owner = await (this.createQueryBuilder().relation(Ledger, "owner").of(ledger).loadOne<User>() as Promise<User>);
    }
    return ledger.owner;
  }

  async getAccounts(ledger: Ledger): Promise<Account[]> {
    if (!ledger.accounts) {
      ledger.accounts = await (this.createQueryBuilder().relation(Ledger, "accounts").of(ledger).loadMany() as Promise<Account[]>);
    }
    return ledger.accounts;
  }
}
