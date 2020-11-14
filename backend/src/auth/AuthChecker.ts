import { AuthChecker } from "type-graphql";

import { AppUserContext } from "../context";


export const authChecker: AuthChecker<AppUserContext> = ({ context: ctx }, roles) => {
  if (roles.length === 0) {
    if (ctx.getSessionUser()) {
      return true;
    }
  }

  return false;
};
