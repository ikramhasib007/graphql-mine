import { GraphQLServer } from 'graphql-yoga';

// Scalar Types = String, Boolean, Int, Float, ID
// Non-Scalar/Custom Types = Array, Object
const users = [
  {
    id: '1',
    name: 'Ikram',
    email: 'ikramhasib007@gmail.com',
    age: 32
  },
  {
    id: '2',
    name: 'Sarah',
    email: 'sarah@gmail.com'
  },
  {
    id: '3',
    name: 'John',
    email: 'john@gmail.com'
  },
]
const posts = [
  {
    id: '1',
    title: 'test title 1',
    body: 'test body 1',
    published: false,
    author: '1'
  },
  {
    id: '2',
    title: 'summer section sale',
    body: 'hello there is all about summer sale',
    published: true,
    author: '1'
  },
  {
    id: '3',
    title: 'winter is comming',
    body: 'summer is almost gone',
    published: true,
    author: '2'
  },
]
// Type Definations (Schema) / Application Schema
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
  }
`

// Resolvers / Function
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if(!args.query) return users;
      
      return users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()))
    },
    posts(parent, args, ctx, info) {
      if(!args.query) return posts;

      return posts.filter((post) => {
        const isTitleMatched = post.title.toLowerCase().includes(args.query.toLowerCase());
        const isBodyMatched = post.body.toLowerCase().includes(args.query.toLowerCase());

        return isTitleMatched || isBodyMatched;
          
      })
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
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author)
    }
  }
}

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
  console.log('Server is up!');
})