import { DefaultState, Middleware } from "koa";
import { getManager } from "typeorm";

import { AppUserContext } from "../context";
import { User } from "../entity";


export const userStateMiddleware: Middleware<DefaultState, AppUserContext> = async (ctx, next) => {
  if (ctx.session && ctx.session.userId) {
    const userId = ctx.session.userId;
    ctx.setSessionUser(await getManager().findOne(User, { where: { userId } }));
  }

  return next();
};
