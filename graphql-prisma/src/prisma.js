import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
  typeDefs: './src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
})

// prisma.query.users(null, '{ id name email posts { id published title } }').then(data => {
//   console.log('data: ', JSON.stringify(data, undefined, 2));

// })

// prisma.query.comments(null, '{ id text author { id name } }').then(data => {
//   console.log('data: ', JSON.stringify(data, undefined, 2));
// })

// prisma.mutation.createPost({
//   data: {
//     title: "GraphQL 102",
//     body: "",
//     published: false,
//     author: {
//       connect: {
//         id: "ckeb93x8j00180752bpa1b69t"
//       }
//     }
//   }
// }, '{ id title published body }').then(data => {
//   console.log(data);
//   return prisma.query.users(null, '{ id name email posts {id title, published} }')
// }).then(data => {
//   console.log('data: ', JSON.stringify(data, undefined, 2));
// })

// prisma.mutation.updatePost({
//   data: {
//     published: true
//   },
//   where: {
//     id: 'cked44udd022s0752uzadej3y'
//   }
// }, '{ id title published body }').then(data => {
//   console.log(data);
//   return prisma.query.users(null, '{ id name email posts {id title, published} }')
// }).then(data => {
//   console.log('data: ', JSON.stringify(data, undefined, 2));
// })

// using async/await
const createPostForUser = async (authorId, data) => {
  const post = await prisma.mutation.createPost({
    data: {
      ...data,
      author: {
        connect: {
          id: authorId
        }
      }
    }
  }, '{ id }');
  const user = await prisma.query.user({where: {
    id: authorId
  }}, '{ id name email posts { id title body published } }');
  
  return user;
}

createPostForUser('ckee3daec023d07525dsm47jp', {
  title: 'New GraphQL 101',
  body: "",
  published: false
}).then(user => {
  console.log(JSON.stringify(user, undefined, 2))
})