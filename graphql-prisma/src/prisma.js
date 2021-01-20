import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from './resolvers'

const prisma = new Prisma({
  typeDefs: './src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: "thisismysupersecrettextikram",
  fragmentReplacements
})

export default prisma

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
// const createPostForUser = async (authorId, data) => {
//   const userExists = await prisma.exists.User({id: authorId});
//   if(!userExists) throw new Error('User not found')
//   const post = await prisma.mutation.createPost({
//     data: {
//       ...data,
//       author: {
//         connect: {
//           id: authorId
//         }
//       }
//     }
//   }, '{ author { id name email posts { id title body published } } }');
//   return post.author;
// }

// createPostForUser('ckee3daec023d07525dsm47jp', {
//   title: 'New GraphQL 101',
//   body: "",
//   published: false
// }).then(user => {
//   console.log(JSON.stringify(user, undefined, 2))
// }).catch(err => console.log(err.message))

// const updatePostForUser = async (postId, data) => {
//   const postExists = await prisma.exists.Post({ id: postId });
//   if(!postExists) throw new Error('Post not found')
//   const post = await prisma.mutation.updatePost({
//     data: {
//       ...data
//     },
//     where: {
//       id: postId
//     }
//   }, '{ author { id name email posts { id title body published } } }')
//   return post.author;
// }

// updatePostForUser('ckef4ia5707fb073440d4r86c', {
//   title: 'New GraphQL 1022',
//   published: true
// }).then(user => {
//   console.log(JSON.stringify(user, undefined, 2))
// }).catch(err => console.log(err.message))