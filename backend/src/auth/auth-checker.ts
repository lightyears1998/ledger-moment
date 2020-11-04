import { AuthChecker } from "type-graphql";

import { AppContext } from "../context";

export const authChecker: AuthChecker<AppContext> = ({ context }, roles) => {
  let pass = false;

  if (roles.length === 0) {
    if (!context.state.userId) {
      pass = false;
    }
  }

  return pass;
};
