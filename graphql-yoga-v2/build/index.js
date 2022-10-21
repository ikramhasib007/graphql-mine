"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("@graphql-yoga/node");
const server = (0, node_1.createServer)({
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
});
server.start();
