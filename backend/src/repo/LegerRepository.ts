import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";

import { Account, Ledger } from "../entity";

@Service()
@EntityRepository(Ledger)
export class LedgerRepository extends Repository<Ledger> {
  addAccount(ledgerId: number, account: Account) {
    const ledger = this.findOneOrFail({ where: { ledgerId } });
  }
}
