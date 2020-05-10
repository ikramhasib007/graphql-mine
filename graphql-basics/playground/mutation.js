import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/dist/v4';

// Scalar Types = String, Boolean, Int, Float, ID
// Non-Scalar/Custom Types = Array, Object
let users = [
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
let posts = [
  {
    id: '11',
    title: 'test title 1',
    body: 'test body 1',
    published: false,
    author: '1'
  },
  {
    id: '12',
    title: 'summer section sale',
    body: 'hello there is all about summer sale',
    published: true,
    author: '1'
  },
  {
    id: '13',
    title: 'winter is comming',
    body: 'summer is almost gone',
    published: true,
    author: '2'
  },
]
let comments = [
  {
    id: '111',
    text: 'first comment here',
    author: '1',
    post: '11'
  },
  {
    id: '112',
    text: 'second comment here',
    author: '1',
    post: '12'
  },
  {
    id: '113',
    text: 'third comment here',
    author: '2',
    post: '12'
  },
  {
    id: '114',
    text: 'fourth comment here',
    author: '1',
    post: '13'
  }
]
// Type Definations (Schema) / Application Schema
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  type Mutation {
    createUser(data: CreateUserInput!): User!
    deleteUser(id: ID!): User!
    createPost(post: CreatePostInput!): Post!
    createComment(comment: CreateCommentInput!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
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
    comments(parent, args, ctx, info) {
      return comments; 
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
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some(user => user.email === args.data.email);
      if(emailTaken) {
        throw new Error('Email taken.')
      }
      let user = {
        id: uuidv4(),
        ...args.data
      }
      users.push(user);
      return user;
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex(user => user.id === args.id);
      if(userIndex === -1) throw new Error('User not found');
      const deletedUsers = users.splice(userIndex, 1);
      posts = posts.filter(post => {
        const match = post.author === args.id
        if(match) {
          comments = comments.filter(comment => comment.post !== post.id)
        }
        return !match;
      })
      comments = comments.filter(comment => comment.author !== args.id)
      return deletedUsers[0];
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.post.author)
      if(!userExists) {
        throw new Error('User not found')
      }
      const post = {
        id: uuidv4(),
        ...args.post
      }
      posts.push(post);
      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.comment.author)
      if(!userExists) throw new Error('Unable to find user')
      const postExists = posts.some(post => post.id === args.comment.post && post.published)
      if(!postExists) throw new Error('Unable to find post')

      const comment = {
        id: uuidv4(),
        ...args.comment
      }

      comments.push(comment);

      return comment;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author)
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.post === parent.id)
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id)
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.author === parent.id)
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author)
    },
    post(parent, args, ctx, info) {
      return posts.find(post => post.id === parent.post)
    }
  }
}

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
  console.log('Server is up!');
})