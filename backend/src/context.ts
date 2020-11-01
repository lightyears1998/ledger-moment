import { Context } from "koa";
import koaSession from "koa-generic-session";


export interface AppContext extends Context {
  session: koaSession.Session
}
