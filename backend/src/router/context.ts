import { Context } from "koa";


export interface AppContext extends Context {
  session: Record<string, unknown>
}
