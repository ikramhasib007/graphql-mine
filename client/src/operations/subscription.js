import { gql } from '@apollo/client'
import { USER_FIELDS } from './fragments'

export const SUBSCRIBE_USER = gql`
  ${USER_FIELDS}

  subscription onSubscribeUser {
    user {
      mutation
      data {
        ...UserFields
      }
    }
  }
`