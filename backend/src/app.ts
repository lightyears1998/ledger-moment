import path from "path";

import Koa from "koa";
import { ApolloServer } from "apollo-server-koa";
import { buildSchema } from "type-graphql";
import { printSchema } from "graphql";
import * as typeorm from "typeorm";
import { createConnection } from "typeorm";
import fs from "fs-extra";
import { Container } from "typedi";
import responseTimeMiddleware from "koa-response-time";
import corsMiddleware from "@koa/cors";
import sessionMiddleware from "koa-generic-session";
import redisStore from "koa-redis";
import koaSession from "koa-generic-session";

import {
  VAR_DIR, PORT, SECRET, SESSION_KEY
} from "./config";
import { UserResolver } from "./resolver";
import { AppContext } from "./router";
import { genSecret } from "./utils";
import { redis } from "./utils/redis";

async function bootstrap() {
  // 设置 Database 路径
  const dbPath = path.join(VAR_DIR, "./database.sqlite3");
  await fs.ensureDir(path.dirname(dbPath));
  console.log("💾 Using sqlite database: " + dbPath);

  // 设置 DI 容器
  typeorm.useContainer(Container);

  // 连接数据库
  await createConnection({
    type: "better-sqlite3",
    database: dbPath,
    synchronize: true
  });

  // 生成 GraphQLSchema
  const schema = await buildSchema({ resolvers: [UserResolver] });
  const schemaPath = path.join(VAR_DIR, "./schema.graphql");
  await fs.writeFile(schemaPath, printSchema(schema));
  console.log("📁 Schema prints to: " + schemaPath);

  // 初始化 ApolloServer
  const server = new ApolloServer({
    schema, playground: true, context: (ctx: AppContext) => ctx
  });

  // 初始化 Koa
  const app = new Koa();
  app.keys = [SECRET ? SECRET : genSecret()];
  app.use(responseTimeMiddleware({ hrtime: true }));
  app.use(corsMiddleware({ credentials: true }));
  app.use(sessionMiddleware({
    key: SESSION_KEY,
    cookie: {
      signed: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30 /* 30 天 */
    },
    store: redisStore({ client: redis }) as unknown as koaSession.SessionStore
  }));
  app.use(server.getMiddleware());

  // 运行 Koa
  app.listen({ port: PORT }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
}

bootstrap();
