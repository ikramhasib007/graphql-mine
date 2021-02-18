import ApolloClient, { gql } from 'apollo-boost';

const client = new ApolloClient({
  uri: 'http://localhost:4000'
})

const getUsers = gql`
  query {
    users {
      id
      name
      email
    }
  }
`

client.query({
  query: getUsers
}).then(({loading, errors, data}) => {
  let html = '';

  data.users.forEach(user => {
    html += `
      <div>
        <h3>${user.name}</h3>
      </div>
    `
  })

  document.getElementById('users').innerHTML = html

})

client.query({
  query: gql`
    query {
      posts {
        title
        author {
          name
        }
      }
    }
  `
}).then(({ loading, errors, data }) => {
  let html = '';
  
  data.posts.forEach(post => {
    html += `
      <div>
        <h3>${post.title}</h3>
        <h5>${post.author.name}</h5>
      </div>
    `
  })

  document.getElementById('posts').innerHTML = html
})