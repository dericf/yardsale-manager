import "semantic-ui-css/semantic.min.css";

import AlertProvider from "../hooks/useAlert";
import AuthProvider from "../hooks/useAuth";
import LoadingProvider, { useIsLoading } from "../hooks/useIsLoading";
// import DataProvider from "../hooks/useData";
import { ToastProvider, useToasts } from "react-toast-notifications";

function MyApp({ Component, pageProps }) {
  return (
    <ToastProvider>
      <AlertProvider>
        <LoadingProvider>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </LoadingProvider>
      </AlertProvider>
    </ToastProvider>
  );
}

export default MyApp;
