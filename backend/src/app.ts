import path from "path";

import Koa from "koa";
import { ApolloServer } from "apollo-server-koa";
import { buildSchema } from "type-graphql";
import { GraphQLSchema, printSchema } from "graphql";
import { useContainer, createConnection } from "typeorm";
import fs from "fs-extra";
import { Container } from "typedi";
import responseTimeMiddleware from "koa-response-time";
import corsMiddleware from "@koa/cors";
import sessionMiddleware from "koa-generic-session";
import redisStore from "koa-redis";
import koaSession from "koa-generic-session";

import {
  APP_VAR_DIR, APP_PORT, APP_SECRET, APP_SESSION_KEY
} from "./config";
import { UserResolver } from "./resolver";
import { AppContext } from "./context";
import { genSecret, redis } from "./utils";
import * as entities from "./entity";


async function setupDatabase(): Promise<void> {
  const dbPath = path.join(APP_VAR_DIR, "./database.sqlite3");
  await fs.ensureDir(path.dirname(dbPath));
  console.log("💾 Using sqlite database: " + dbPath);

  useContainer(Container);

  await createConnection({
    type: "better-sqlite3",
    database: dbPath,
    synchronize: true,
    entities: [entities.User]
  });
}


async function setupGraphQLSchema(): Promise<GraphQLSchema> {
  const schema = await buildSchema({ resolvers: [UserResolver], container: Container });
  const schemaPath = path.join(APP_VAR_DIR, "./schema.graphql");
  await fs.writeFile(schemaPath, printSchema(schema));
  console.log("📁 Schema prints to: " + schemaPath);

  return schema;
}


async function setupApolloServer(schema: GraphQLSchema) {
  const server = new ApolloServer({
    schema, playground: true, context: (ctx: AppContext) => ctx
  });

  return server;
}

async function setupKoa(server: ApolloServer): Promise<Koa> {
  const app = new Koa();
  app.keys = [APP_SECRET ? APP_SECRET : genSecret()];
  app.use(responseTimeMiddleware({ hrtime: true }));
  app.use(corsMiddleware({ credentials: true }));
  app.use(sessionMiddleware({
    key: APP_SESSION_KEY,
    cookie: {
      signed: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30 /* 30 天 */
    },
    store: redisStore({ client: redis }) as unknown as koaSession.SessionStore
  }));
  app.use(server.getMiddleware());

  return app;
}

async function bootstrap() {
  await setupDatabase();
  const schema = await setupGraphQLSchema();
  const server = await setupApolloServer(schema);
  const app = await setupKoa(server);

  await new Promise((resolve) => {
    app.listen({ port: APP_PORT }, resolve);
  });

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

bootstrap();
