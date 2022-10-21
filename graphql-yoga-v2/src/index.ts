import { createServer, createPubSub } from "@graphql-yoga/node";
import prisma from "./prisma";

const pubSub = createPubSub();

const server = createServer({
  schema: {
    typeDefs: /* GraphQL */ `
      type Query {
        hello: String
      }
    `,
    resolvers: {
      Query: {
        hello: () => "Hello from Yoga!",
      },
    },
  },
  context(request) {
    return {
      request,
      prisma,
      pubSub,
    };
  },
});

server.start().then(() => {
  console.log(`🚀 Server ready`);
});
