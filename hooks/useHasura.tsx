import { useState, useContext, createContext } from "react";
import { useToasts } from "react-toast-notifications";

import React from "react";
import {
  ApolloClient,
  ApolloClientOptions,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { HasuraContextInterface } from "../types/Context";
import { useQuery } from "@apollo/client";
import jwtDecode from "jwt-decode";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "apollo-link-context";
import { RequestOptions } from "https";

export const HasuraContext = createContext<HasuraContextInterface>(
  {} as HasuraContextInterface,
);
interface GraphQlRequestBody {
  query: string;
  variables?: [];
}

export default function HasuraProvider({ children }) {
  const [context, setContext] = useState();

  const query = async (q: string, variables?: any) => {
    let token = localStorage?.getItem("accessToken");
    let jwt = jwtDecode(token);
    let requestBody: GraphQlRequestBody = {
      query: q,
    };
    if (variables) requestBody.variables = variables;

    let fetchOptions = {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "X-Hasura-Role": jwt["https://hasura.io/jwt/claims"]["x-hasura-role"],
        "X-Hasura-User-Id":
          jwt["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
      },
      body: JSON.stringify(requestBody),
    };
    let response: Response;
    try {
      response = await fetch(
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
        fetchOptions,
      );
      let { data } = await response.json();
      console.log("Data: ", data.data);
      return data;
    } catch (error) {
      console.log("Error with query");
      console.log(error);
    }
  };

  const mutation = async (m: string, variables?: any) => {
    let token = localStorage?.getItem("accessToken");
    let jwt = jwtDecode(token);
    let requestBody = {
      mutation: m,
    };
    if (variables) requestBody.variables = variables;
    let fetchOptions = {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "X-Hasura-Role": jwt["https://hasura.io/jwt/claims"]["x-hasura-role"],
        "X-Hasura-User-Id":
          jwt["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
      },
      body: JSON.stringify(requestBody),
    };
    let response = await fetch(
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
      fetchOptions,
    );
    let data = await response.json();
    console.log("Data: ", data);
    return data;
  };

  return (
    <HasuraContext.Provider value={{ context, query, mutation }}>
      {children}
    </HasuraContext.Provider>
  );
}

export const useHasura = () => {
  const ctx = useContext<HasuraContextInterface>(HasuraContext);
  return ctx;
};

// const httpLink = new HttpLink({
//   uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
// });

// // const wsLink = new WebSocketLink({
// // 	uri: process.env.NEXT_PUBLIC_GRAPHQL_WS_ENDPOINT,
// // 	options: {
// // 		reconnect: true,
// // 		connectionParams: {
// // 			headers: {
// // 				Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
// // 			},
// // 		},
// // 	},
// // });

// const link = split(
//   // split based on operation type
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === "OperationDefinition" &&
//       definition.operation === "subscription"
//     );
//   },
//   // wsLink,
//   httpLink,
// );

// const authLink = setContext((_, { headers }) => {
//   const token = localStorage.getItem("accessToken");

//   let jwt = jwtDecode(token);
//   console.log("JWT: ");
//   console.log(jwt);
//   // TODO: IMPORTANT: check if token is expired here. If it is -> use refresh token to get another.
//   return {
//     headers: {
//       ...headers,
//       Authorization: token ? `Bearer ${token}` : "",
//       "X-Hasura-Role": jwt["https://hasura.io/jwt/claims"]["x-hasura-role"],
//       "X-Hasura-User-Id":
//         jwt["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
//     },
//   };
// });

// const appClient = new ApolloClient({
//   link: authLink.concat(link),
//   cache: new InMemoryCache(),
// });

// const [client, setClient] = useState(appClient);
