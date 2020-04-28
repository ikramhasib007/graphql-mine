import { GraphQLServer } from 'graphql-yoga';

// Scalar Types = String, Boolean, Int, Float, ID
// Non-Scalar/Custom Types = Array, Object

// Type Definations (Schema) / Application Schema
const typeDefs = `
  type Query {
    greeting(name: String, position: String): String!
    add(a: Float!, b: Float!): Float!
    grades: [Int!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!,
    name: String!,
    email: String!,
    age: Int
  }

  type Post {
    id: ID!
    title: String!,
    body: String!,
    published: Boolean!
  }
`

// Resolvers / Function
const resolvers = {
  Query: {
    greeting(parent, args, ctx, info) {
      if(args.name && args.position) return `Hello ${args.name}! You are my favorite ${args.position}.`
      return 'Hello!'
    },
    add(parent, args, ctx, info) {
      return args.a + args.b
    },
    grades(parent, args, ctx, info) {
      return [99, 80, 86]
    },
    me() {
      return {
        id: '123098',
        name: 'Mike',
        email: 'mike@example.com',
        age: 28
      }
    },
    post() {
      return {
        id: '123456',
        title: 'This is my post title',
        body: 'This is my post body',
        published: false
      }
    }
  }
}

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
  console.log('Server is up!');
})