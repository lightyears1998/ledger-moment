import path from "path";

import Koa from "koa";
import { ApolloServer } from "apollo-server-koa";
import { buildSchema } from "type-graphql";
import { GraphQLSchema, printSchema } from "graphql";
import { useContainer, createConnection } from "typeorm";
import fs from "fs-extra";
import { Container } from "typedi";
import responseTimeMiddleware from "koa-response-time";
import compressMiddleware from "koa-compress";
import corsMiddleware from "@koa/cors";
import sessionMiddleware from "koa-session";
import redisStore from "koa-redis";
import {
  fieldExtensionsEstimator, getComplexity, simpleEstimator
} from "graphql-query-complexity";

import {
  APP_VAR_DIR, APP_HOST, APP_PORT, APP_SECRET, QUERY_COMPLEXITY_LIMIT, APP_PROXY
} from "./config";
import { genSecret, redis } from "./utils";
import { authChecker } from "./auth/AuthChecker";
import { appUserContextMiddleware } from "./auth/AppUserContextMiddleware";
import { setupUserContext } from "./context";
import { RoleService } from "./service/RoleService";

async function setupDatabase(): Promise<void> {
  const dbPath = path.join(APP_VAR_DIR, "./database.sqlite3");
  await fs.ensureDir(path.dirname(dbPath));
  console.log("💾 Using sqlite database: " + dbPath);

  useContainer(Container);

  await createConnection({
    type: "better-sqlite3",
    database: dbPath,
    synchronize: true,
    logging: "all",
    entities: [`${__dirname}/entity/**/*.{ts,js}`]
  });

  await Container.get(RoleService).init();
}

async function setupGraphQLSchema(): Promise<GraphQLSchema> {
  const schema = await buildSchema({
    resolvers: [`${__dirname}/resolver/**/*.{ts,js}`],
    container: Container,
    authChecker: authChecker
  });
  const schemaPath = path.join(APP_VAR_DIR, "./schema.graphql");
  await fs.writeFile(schemaPath, printSchema(schema));
  console.log("📁 Schema prints to: " + schemaPath);

  return schema;
}

async function setupApolloServer(schema: GraphQLSchema) {
  const server = new ApolloServer({
    schema,
    playground: true,
    context: ({ ctx }) => ctx,
    plugins: [
      {
        /*
         * GraphQL 查询复杂度插件
         * 参阅：https://github.com/MichalLytek/type-graphql/blob/1d00afe6da943d57bf64d46814c67c89f2e1af82/docs/complexity.md
         */
        requestDidStart: () => ({
          didResolveOperation({ request, document }) {
            const complexity = getComplexity({
              schema,
              operationName: request.operationName,
              query: document,
              variables: request.variables,
              estimators: [fieldExtensionsEstimator(), simpleEstimator({ defaultComplexity: 1 })]
            });

            if (complexity > QUERY_COMPLEXITY_LIMIT) {
              throw new Error(`本次请求具有复杂度 ${complexity}，因超过复杂度上限限制 ${QUERY_COMPLEXITY_LIMIT} 而未被执行。`);
            }
          }
        })
      }
    ]
  });

  return server;
}

async function setupKoa(server: ApolloServer): Promise<Koa> {
  const app = new Koa();

  app.proxy = APP_PROXY;
  app.keys = [APP_SECRET ? APP_SECRET : genSecret()];

  app.use(responseTimeMiddleware({ hrtime: true }));
  app.use(corsMiddleware({ credentials: true }));
  app.use(sessionMiddleware({
    maxAge: 1000 * 60 * 60 * 24 * 7, key: "moment:sess", store: redisStore({ client: redis })
  }, app));
  app.use(appUserContextMiddleware);
  app.use(compressMiddleware());
  app.use(server.getMiddleware());

  setupUserContext(app);

  return app;
}

async function bootstrap() {
  await setupDatabase();
  const schema = await setupGraphQLSchema();
  const server = await setupApolloServer(schema);
  const app = await setupKoa(server);

  await new Promise((resolve) => {
    app.listen({ host: "localhost", port: APP_PORT }, resolve);
  });

  console.log(`🚀 Server ready at http://${APP_HOST}:${APP_PORT}${server.graphqlPath}`);
}

bootstrap();
