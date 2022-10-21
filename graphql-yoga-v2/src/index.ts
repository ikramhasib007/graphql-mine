import { createServer } from "@graphql-yoga/node";
import { createContext } from "./context";
import { resolvers } from "./resolvers";

const server = createServer({
  schema: {
    typeDefs: /* GraphQL */ `
      type Query {
        users: [User!]!
        user(id: ID!): User!
        posts: [Post!]!
        post(id: ID!): Post!
      }

      type Mutation {
        createUser(data: CreateUserInput!): User!
      }

      type User {
        id: ID!
        email: String!
        password: String
        name: String
        photo: File
        profile: Profile
        posts: [Post!]!
      }

      type Profile {
        id: ID!
        bio: String
        user: User
      }

      type Post {
        id: ID!
        title: String!
        content: String
        photos: [File!]!
        author: User
      }

      type File {
        id: ID!
        path: String!
        filename: String!
        mimetype: String!
        encoding: String!
        user: User
        post: Post
      }

      input CreateUserInput {
        name: String!
        email: String!
      }
    `,
    resolvers,
  },
  context: createContext,
});

server.start().then(() => {
  console.log(`🚀 Server ready`);
});
