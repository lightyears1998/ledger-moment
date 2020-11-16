import { Entity, PrimaryColumn } from "typeorm";

import { RoleName } from "./RoleName";

@Entity()
export class Role {
  @PrimaryColumn()
  name!: RoleName
}
