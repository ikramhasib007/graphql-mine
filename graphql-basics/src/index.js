import { GraphQLServer } from 'graphql-yoga';

// Scalar Types = String, Boolean, Int, Float, ID
// Non-Scalar/Custom Types = Array, Object

// Type Definations (Schema) / Application Schema
const typeDefs = `
  type Query {
    title: String!
    price: Float!
    releaseYear: Int
    rating: Float
    inStock: Boolean!
  }
`

// Resolvers / Function
const resolvers = {
  Query: {
    title() {
      return 'This is my first query!'
    },
    price() {
      return 9.99
    },
    releaseYear() {
      return 2007
    },
    rating() {
      return 4.46
    },
    inStock() {
      return true
    }
  }
}

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
  console.log('Server is up!');
})