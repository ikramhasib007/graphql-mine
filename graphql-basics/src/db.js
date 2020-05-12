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
const comments = [
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

const db = {
  users, posts, comments
}

export default db