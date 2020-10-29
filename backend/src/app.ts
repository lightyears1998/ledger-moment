import Koa from "koa";
import { ApolloServer } from "apollo-server-koa";
import { UserResolver } from "./resolver";
import { buildSchema } from "type-graphql";
import { PORT } from "./config";

async function bootstrap() {
  const schema = await buildSchema({ resolvers: [UserResolver] });

  const server = new ApolloServer({ schema, playground: true });

  const app = new Koa();
  app.use(server.getMiddleware());

  app.listen({ port: PORT }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
}

bootstrap();
