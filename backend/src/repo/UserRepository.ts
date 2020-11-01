import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";

import { User } from "../entity";

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findByUsername(username: string): Promise<User | undefined> {
    return this.findOne({ username });
  }
}
