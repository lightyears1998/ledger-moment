import { AuthChecker } from "type-graphql";

import { AppContext } from "../context";

export const authChecker: AuthChecker<AppContext> = ({ context }, roles) => {
  if (roles.length === 0) {
    if (context.state.userId) {
      return true;
    }
  }

  return false;
};
