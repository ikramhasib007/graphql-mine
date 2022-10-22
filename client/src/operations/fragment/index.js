import { gql } from "@apollo/client";

export const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    name
    email
    password
    photo {
      id
      path
      filename
    }
    profile {
      id
      bio
    }
    createdAt
    updatedAt
  }
`

export const POST_FIELDS = gql`
  fragment PostFields on Post {
    id
    title
    content
    createdAt
    updatedAt
  }
`