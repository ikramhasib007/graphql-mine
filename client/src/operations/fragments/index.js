import { gql } from "@apollo/client";

export const CORE_FILE_FIELDS = gql`
  fragment CoreFileFields on File {
    id
    filename
    path
  }
`

export const FILE_FIELDS = gql`
  ${CORE_FILE_FIELDS}

  fragment FileFields on File {
    ...CoreFileFields
  }
`

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