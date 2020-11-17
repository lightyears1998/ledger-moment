import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";

import { Account, Record } from "../entity";

@Service()
@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {
  async addRecord(account: Account, record: Record) {

  }
}
