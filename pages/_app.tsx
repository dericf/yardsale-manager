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
  return (
    <ToastProvider placement="top-center">
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
