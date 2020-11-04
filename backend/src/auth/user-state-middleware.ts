import { DefaultState, Middleware } from "koa";

import { AppContext, AppUserState } from "../context";


export const userStateMiddleware: Middleware<DefaultState, AppContext & { state: AppUserState }> = (ctx, next) => {
  if (ctx.session && ctx.session.userId) {
    ctx.state.userId = ctx.session.userId;
  }

  return next();
};
