import {
  EntityManager, EntityRepository, Repository
} from "typeorm";
import { InjectManager } from "typeorm-typedi-extensions";

import {
  Account, Ledger, Record, SetBalanceRecord
} from "../entity";

@EntityRepository(Record)
export class RecordRepository extends Repository<Record> {
  @InjectManager()
  manager!: EntityManager

  async findByAccount(account: Account): Promise<Record[]> {
    return this.find({ account });
  }

  async findByLedger(ledger: Ledger): Promise<Record[]> {
    return this.find({ ledger });
  }

  async addSetBalanceRecord(account: Account, balance: number): Promise<SetBalanceRecord> {
    const record = this.manager.create(SetBalanceRecord, { account, balance });
    return this.manager.save(record);
  }
}
