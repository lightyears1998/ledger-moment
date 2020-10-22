import Koa from "koa";
import { ApolloServer, gql } from "apollo-server-koa";
import { PORT } from "./config";

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = { Query: { hello: () => "Hello world!" } };

const server = new ApolloServer({
  typeDefs, resolvers, playground: true
});

const app = new Koa();
app.use(server.getMiddleware());

app.listen({ port: PORT }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
