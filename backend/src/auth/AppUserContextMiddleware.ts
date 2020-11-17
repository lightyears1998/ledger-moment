import { DefaultState, Middleware } from "koa";
import { getManager } from "typeorm";

import { AppUserContext } from "../context";
import { User } from "../entity";

export const appUserContextMiddleware: Middleware<DefaultState, AppUserContext> = async (ctx, next) => {
  if (ctx.session && ctx.session.userId) {
    const userId = ctx.session.userId;
    const user = await getManager().findOne(User, { where: { userId } });

    ctx.setSessionUser(user);
  }

  return next();
};
