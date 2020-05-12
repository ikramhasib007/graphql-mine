const Query = {
  users(parent, args, { db }, info) {
    if(!args.query) return db.users;
    
    return db.users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()))
  },
  posts(parent, args, { db }, info) {
    if(!args.query) return db.posts;

    return db.posts.filter((post) => {
      const isTitleMatched = post.title.toLowerCase().includes(args.query.toLowerCase());
      const isBodyMatched = post.body.toLowerCase().includes(args.query.toLowerCase());

      return isTitleMatched || isBodyMatched;
        
    })
  },
  comments(parent, args, { db }, info) {
    return db.comments; 
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