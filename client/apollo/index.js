import getConfig from 'next/config'
import { ApolloClient, InMemoryCache } from '@apollo/client';

const { publicRuntimeConfig } = getConfig()

export default (token) => new ApolloClient({
  cache: new InMemoryCache(),
  uri: publicRuntimeConfig.API_URI
})