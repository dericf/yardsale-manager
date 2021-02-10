import "semantic-ui-css/semantic.min.css";
import "../css/flex.css";
import "../css/global.css";

import AlertProvider from "../hooks/useAlert";
import AuthProvider from "../hooks/useAuth";
import LoadingProvider, { useIsLoading } from "../hooks/useIsLoading";
// import DataProvider from "../hooks/useData";
import { ToastProvider, useToasts } from "react-toast-notifications";
import YardSalesProvider from "../hooks/useYardsales";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  HttpLink,
  InMemoryCache,
  split,
  useApolloClient,
} from "@apollo/client";
import jwtDecode from "jwt-decode";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import HasuraProvider from "../hooks/useHasura";
import SellersProvider from "../hooks/useSeller";

function MyApp({ Component, pageProps }) {
  // const httpLink = createHttpLink({
  //   uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  // });

  // const wsLink = new WebSocketLink({
  // 	uri: process.env.NEXT_PUBLIC_GRAPHQL_WS_ENDPOINT,
  // 	options: {
  // 		reconnect: true,
  // 		connectionParams: {
  // 			headers: {
  // 				Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  // 			},
  // 		},
  // 	},
  // });

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
  //   // get the authentication token from local storage if it exists
  //   const token = localStorage?.getItem("accessToken");
  //   // return the headers to the context so httpLink can read them
  //   let jwt = jwtDecode(token);
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

  // const client = new ApolloClient({
  //   link: authLink.concat(httpLink),
  //   cache: new InMemoryCache(),
  //   ssrMode: !process.browser,
  // });

  return (
    <ToastProvider>
      <AlertProvider>
        <LoadingProvider>
          <AuthProvider>
            <HasuraProvider>
              <YardSalesProvider>
                <SellersProvider>
                  <Component {...pageProps} />
                </SellersProvider>
              </YardSalesProvider>
            </HasuraProvider>
          </AuthProvider>
        </LoadingProvider>
      </AlertProvider>
    </ToastProvider>
  );
}

export default MyApp;
