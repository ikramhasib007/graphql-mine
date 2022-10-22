import fetch from 'cross-fetch'
import getConfig from 'next/config'
import { ApolloClient, InMemoryCache, split, from, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error'

const { publicRuntimeConfig } = getConfig()

const httpLink = token => new HttpLink({
  uri: publicRuntimeConfig.API_PATH,
  fetch: (uri, options) => {
    options.headers.Authorization = token ? `Bearer ${token}` : "";
    return fetch(uri, options);
  }
})

const splitLink = token => httpLink(token)

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors && (process.env.NODE_ENV !== 'production'))
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations, undefined, 2)}, Path: ${JSON.stringify(path, undefined, 2)}`,
      ),
    );

  if (networkError) console.log(`[Network error]: ${JSON.stringify(networkError, undefined, 2)}`);
});

const getClient = (token) => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from([errorLink, splitLink(token)]),
    connectToDevTools: process.env.NODE_ENV !== 'production',
    name: 'playground-client',
    version: '1.0.0',
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    }
  })
}

export default getClient