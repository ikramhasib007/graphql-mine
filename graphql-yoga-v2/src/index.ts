import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { createServer } from "@graphql-yoga/node";
import { createContext } from "./context";
import { resolvers } from "./resolvers";

const typeDefs = loadSchemaSync("./**/*.graphql", {
  loaders: [new GraphQLFileLoader()],
});

const port = 4000;

const server = createServer({
  port,
  cors: {
    origin: ["http://localhost:3000"],
    credentials: true,
    allowedHeaders: ["X-Custom-Header", "Authorization", "content-type"],
    methods: ["POST"],
  },
  schema: {
    typeDefs,
    resolvers,
  },
  graphiql: process.env.NODE_ENV === "development",
  context: createContext,
  multipart: {
    // Maximum allowed file size (in bytes)
    fileSize: 1048576, // unit bytes // size 1M
    // Maximum allowed number of files
    files: 4,
    // Maximum allowed size of content (operations, variables etc...)
    fieldSize: 4194304, // unit bytes // 1M x 4 (maxFiles)
    // Maximum allowed header size for form data
    headerSize: 4194304, // unit bytes // 1M x 4 (maxFiles)
  },
});

server.start().then(() => {
  console.log(`🚀 Server ready`);
});
