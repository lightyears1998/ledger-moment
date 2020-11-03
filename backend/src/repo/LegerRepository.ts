import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";

import { Ledger } from "../entity";

@Service()
@EntityRepository(Ledger)
export class LedgerRepository extends Repository<Ledger> {

}
