const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {};
    if(args.query) {
      opArgs.where = {
        // name_contains: args.query
        OR: [{
          name_contains: args.query
        }, {
          email_contains: args.query
        }]
      }
    }
    return prisma.query.users(opArgs, info);
  },
  posts(parent, args, { prisma }, info) {
    const opArgs = {};
    if(args.query) {
      opArgs.where = {
        OR: [{
          title_contains: args.query
        }, {
          body_contains: args.query
        }]
      }
    }
    return prisma.query.posts(opArgs, info);
 },
  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
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

export default Query