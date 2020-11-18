import { EntityRepository, Repository } from "typeorm";

import {
  Account, Ledger, Record
} from "../entity";

@EntityRepository(Record)
export class RecordRepository extends Repository<Record> {
  async findByAccount(account: Account): Promise<Record[]> {
    return this.find({ account });
  }

  async findByLedger(ledger: Ledger): Promise<Record[]> {
    return this.find({ ledger });
  }
}
