import 'cross-fetch'
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client'
import { onError } from "@apollo/client/link/error";
import { ApolloLink, from } from '@apollo/client/core';
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

const httpLink = token => createUploadLink({
  uri: publicRuntimeConfig.API_URI,
  fetch: (uri, options) => {
    options.headers.Authorization = token ? `Bearer ${token}` : "";
    return fetch(uri, options);
  }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors && (process.env.NODE_ENV !== 'production'))
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations, undefined, 2)}, Path: ${JSON.stringify(path, undefined, 2)}`,
      ),
    );

  if (networkError) console.log(`[Network error]: ${JSON.stringify(networkError, undefined, 2)}`);
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      'X-Custom-Header': null,
    }
  }));

  return forward(operation);
})

const activityMiddleware = new ApolloLink((operation, forward) => {
  // add the recent-activity custom header to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
    }
  }));

  return forward(operation);
})

export default (token) => new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink, authMiddleware, activityMiddleware, httpLink(token)]),
})