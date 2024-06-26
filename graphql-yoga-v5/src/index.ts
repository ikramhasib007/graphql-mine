import * as dotenv from "dotenv";
dotenv.config();

import { createServer } from "node:http";
import { createFetch } from "@whatwg-node/fetch";
import { createYoga, createSchema, useExtendContext } from "graphql-yoga";
import { loadFilesSync } from "@graphql-tools/load-files";
import { resolvers } from "./resolvers";
import prisma from "./prisma";
import { pubSub } from "./pubsub";
import Context from "./context";

const typeDefs = loadFilesSync("./**/*.graphql");

const schema = createSchema({ typeDefs, resolvers });

// Create a Yoga instance with a GraphQL schema.
const yoga = createYoga<Context, any>({
  cors: {
    origin: ["http://localhost:3000"],
    credentials: true,
    allowedHeaders: ["X-Custom-Header", "Authorization", "content-type"],
    methods: ["POST"],
  },
  schema,
  logging: true,
  plugins: [useExtendContext(() => ({ pubSub, prisma }))],
  graphiql:
    process.env.NODE_ENV !== 'production'
      ? {
        subscriptionsProtocol: 'WS',
      }
      : false,
  fetchAPI: createFetch({
    formDataLimits: {
      // Maximum allowed file size (in bytes)
      fileSize: 1048576, // unit bytes // size 1M
      // Maximum allowed number of files
      files: 4,
      // Maximum allowed size of content (operations, variables etc...)
      fieldSize: 4194304, // unit bytes // 1M x 4 (maxFiles)
      // Maximum allowed header size for form data
      headerSize: 4194304, // unit bytes // 1M x 4 (maxFiles)
    },
  }),
});

// Pass it into a server to hook into request handlers.
const server = createServer(yoga);

const HTTP_PORT = process.env.HTTP_PORT || 4000;

// Start the server and you're done!
server.listen(HTTP_PORT, () => {
  console.info(`🚀 Server is running on http://localhost:${HTTP_PORT}/graphql`);
});
