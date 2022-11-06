import { gql } from '@apollo/client'
import { USER_FIELDS } from './fragments'

export const INCREMENT_GLOBAL_COUNTER = gql`
  mutation IncrementGlobalCounter {
    incrementGlobalCounter
  }
`

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

export const SUBSCRIBE_GLOBAL_COUNTER = gql`
  subscription onSubscribeGlobalCounter {
    globalCounter
  }
`