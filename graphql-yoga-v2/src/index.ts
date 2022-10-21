import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { createServer } from "@graphql-yoga/node";
import { createContext } from "./context";
import { resolvers } from "./resolvers";

const typeDefs = loadSchemaSync("./**/*.graphql", {
  loaders: [new GraphQLFileLoader()],
});

const server = createServer({
  schema: {
    typeDefs,
    resolvers,
  },
  context: createContext,
});

server.start().then(() => {
  console.log(`🚀 Server ready`);
});
