import * as dotenv from "dotenv";
dotenv.config();

import { createYoga, createSchema, useExtendContext } from "graphql-yoga";
import { createServer } from "node:http";
import { typeDefs } from "./schema/typeDefs.generated";
import { resolvers } from "./schema/resolvers.generated";
import Context from "./context";
import { pubSub } from "./pubsub";
import prisma from "./prisma";

const yoga = createYoga<Context, any>({
  schema: createSchema({ typeDefs, resolvers }),
  plugins: [useExtendContext(() => ({ pubSub, prisma }))],
  graphiql: process.env.NODE_ENV !== "production",
});
const server = createServer(yoga);

server.listen(4000, () => {
  console.info("🚀 Server is running on http://localhost:4000/graphql");
});
