import Application, { ParameterizedContext } from "koa";
import { Session } from "koa-session";

import { User } from "./entity";

export interface AppSession extends Session {
  userId?: number
}

/*
 * @types/koa-session 内建补全了 BaseContext 的类型定义，
 * 因此这里直接使用 Context 就好。
 */
export type AppContext = ParameterizedContext<Record<string, unknown>> & { session: AppSession | null }

export type AppUserState = {
  user?: User
}

export type AppUserContext = AppContext & {
  state: AppUserState
  setSessionUser: (user: User | undefined) => void
  getSessionUser: () => User | undefined
}

export function setupUserContext(app: Application): void {
  app.context.setSessionUser = function (this: AppUserContext, user: User | undefined) {
    this.state.user = user;
  };

  app.context.getSessionUser = function (this: AppUserContext): User | undefined {
    return this.state.user;
  };
}
