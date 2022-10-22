import { ApolloProvider } from '@apollo/client'
import getClient from '../apollo'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const client = getClient(pageProps.token)

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default MyApp
