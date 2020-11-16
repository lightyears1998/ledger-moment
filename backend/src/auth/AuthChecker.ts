import { AuthChecker } from "type-graphql";
import { getManager } from "typeorm";

import { AppUserContext } from "../context";
import { User } from "../entity";

export const authChecker: AuthChecker<AppUserContext> = async ({ context: ctx }, roles) => {
  const user = ctx.getSessionUser();

  if (!user) {
    return false;
  }

  if (roles.length === 0) {
    return user ? true : false;
  }

  if (!user.roles) {
    user.roles = await getManager().createQueryBuilder().relation(User, "roles").of(user).loadMany();
  }
  ctx.setSessionUser(user);

  if (user.roles.some(role => roles.indexOf(role.name) !== -1)) {
    return true;
  }

  return false;
};
