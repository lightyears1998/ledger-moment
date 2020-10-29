import Koa from "koa";
import { ApolloServer } from "apollo-server-koa";
import { UserResolver } from "./resolver";
import { buildSchema } from "type-graphql";
import { printSchema } from "graphql";
import { createConnection } from "typeorm";
import { VAR_DIR, PORT } from "./config";
import path from "path";
import fs from "fs-extra";

async function bootstrap() {
  const dbPath = path.join(VAR_DIR, "./database.sqlite3");
  await fs.ensureDir(path.dirname(dbPath));
  console.log("💾 Using sqlite database: " + dbPath);

  await createConnection({ type: "better-sqlite3", database: dbPath });

  const schema = await buildSchema({ resolvers: [UserResolver] });
  const schemaPath = path.join(VAR_DIR, "./schema.graphql");
  await fs.writeFile(schemaPath, printSchema(schema));
  console.log("📁 Schema prints to: " + schemaPath);

  const server = new ApolloServer({ schema, playground: true });

  const app = new Koa();
  app.use(server.getMiddleware());

  app.listen({ port: PORT }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
}

bootstrap();
