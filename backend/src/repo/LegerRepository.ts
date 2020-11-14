import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";

import { Ledger } from "../entity";
import { LegerResolver } from "../resolver";

@Service()
@EntityRepository(Ledger)
export class LedgerRepository extends Repository<Ledger> {


  addAccount(ledger: Ledger, account: Account) {

  }
}
