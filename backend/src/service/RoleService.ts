import { Service } from "typedi";
import { EntityManager } from "typeorm";
import { InjectManager } from "typeorm-typedi-extensions";

import { Role, RoleName } from "../entity";

@Service()
export class RoleService {
  @InjectManager()
  manager!: EntityManager

  async init(): Promise<void> {
    const roleNames: Array<RoleName> = [RoleName.USER, RoleName.SERVER_ADMIN];

    for (const name of roleNames) {
      await this.manager.save(Role, { name });
    }
  }
}
