import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
import App from "./App";
//
// Apollo imports
//
import { ApolloProvider } from "@apollo/react-hooks";
// import ApolloProvider from './ApolloProvider'
import ApolloClient from "apollo-client";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
// import { createHttpLink } from 'apollo-link-http'
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import { refreshAccessToken, tokenIsExpired } from "./AuthContext";

const CONFIG = require("./config");

const httpLink = new HttpLink({
  uri: CONFIG.GRAPHQL_ENDPOINT,
});

const wsLink = new WebSocketLink({
  uri: CONFIG.GRAPHQL_WS_ENDPOINT,
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
      },
    },
  },
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink,
);

const jwtDecode = require("jwt-decode");
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("accessToken");

  let jwt = jwtDecode(token);
  // TODO: IMPORTANT: check if token is expired here. If it is -> use refresh token to get another.
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "X-Hasura-Role": jwt["https://hasura.io/jwt/claims"]["x-hasura-role"],
      "X-Hasura-User-Id":
        jwt["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
