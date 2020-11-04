import { Context } from "koa";
import { Session } from "koa-session";

export interface AppSession extends Session {
  userId?: number
}


/*
 * @types/koa-session 内建补全了 BaseContext 的类型定义，
 * 因此这里直接使用 Context 就好。
 */
export type AppContext = Context & { session: AppSession | null }


export type AppUserState = {
  userId?: number
}
