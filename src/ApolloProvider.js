import React from 'react';
import App from './App';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
// import { createHttpLink } from 'apollo-link-http'
import { createHttpLink } from 'apollo-link-http'
import { ApolloProvider } from '@apollo/react-hooks';

import { setContext } from 'apollo-link-context';

import { split } from 'apollo-link'
// import { WebSocketLink } from 'apollo-link-ws'
// import { getMainDefinition } from 'apollo-utilities'


const httpLink = createHttpLink({
  uri: 'https://yardsale-marketplace.herokuapp.com/v1/graphql'
})


const authLink = setContext((_, { headers }) => {
  // console.log('GETTING AUTH TOKEN: ', localStorage.getItem('idToken'))
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('idToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      'X-Hasura-Access-Key': 'JIHDALWhF*&#&(R#@@*(GDSF#',
      'X-Hasura-Role': 'user'
    }
  }
});


// const wsLink = new WebSocketLink({
//   uri: `ws://yardsale-marketplace.herokuapp.com/v1/graphql`,
//   options: {
//     reconnect: true,
//     connectionParams: {
//       authToken: localStorage.getItem('idToken'),
//     },
//   },
// })


// const link = split(
//   ({ query }) => {
//     const { kind, operation } = getMainDefinition(query)
//     return kind === 'OperationDefinition' && operation === 'subscription'
//   },
//   null,
//   authLink.concat(httpLink),
// )


export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)