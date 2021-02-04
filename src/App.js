import React, {
  Component,
  Fragment,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";

import {
  Router,
  Route,
  Switch,
  Redirect,
  Link,
  BrowserRouter,
} from "react-router-dom";

// styles
import "./App.css";
// import {
//   Container,
//   Grid,
//   Header,
//     Divider,
//   Button,
//   Segment,
//   Menu,
//   Icon,
//   Dropdown,
//   Portal,
//   IconGroup,
//   Responsive,
// } from "semantic-ui-react";

import Notifications, { notify } from "react-notify-toast";

import history from "./utils/history";

// import 'semantic-ui-css/semantic.min.css';
import "../semantic/dist/semantic.css";
// import "./index.css";
import "./App.scss";
// import 'semantic-ui-less/themes/flat/globals'

import "react-datepicker/dist/react-datepicker.css";

import PrivateRoute from "./components/PrivateRoute";

import Loading from "./components/layout/Loading";
// import Title from "./components/layout/Title";
// import Footer from "./components/layout/Footer";
// import Sellers from "./pages/Sellers";
import Yardsales from "./pages/Yardsales";
import Home from "./pages/Home";
// import Onboarding from "./pages/Onboarding";
// import Market from "./pages/Market";

// import "./utils/prototypes";

import { NAVBAR_HEIGHT, FOOTER_HEIGHT, TITLE_HEIGHT } from "./constants";

import {
  AuthContext,
  defaultAuth,
  tokenIsExpired,
  checkRefreshInterval,
} from "./AuthContext";
import LoginModal from "./components/modals/LoginModal/LoginModal";
import RegisterModal from "./components/modals/RegisterModal/RegisterModal";
import ForgotPasswordModal from "./components/modals/ForgotPasswordModal/ForgotModalPassword";
import RegistrationConfirmationModal from "./components/modals/RegistrationConfirmationModal/RegistrationConfirmationModal";
import ConfirmNewPasswordModalBody from "./components/modals/ForgotPasswordModal/ConfirmNewPasswordModalBody";
import NotFoundPage from "./pages/NotFoundPage";

// import { GET_USER } from "./graphql/queries";
// import { useQuery } from "@apollo/react-hooks";

// import TopNotifications from "./utils/Notifications";

import SidebarNav from "./components/layout/SidebarNav";
import BottomNavBar from "./components/layout/Footer";
import TestHomePage from "./TestHomePage";
import { Button, Segment } from "semantic-ui-react";

import { defaultAppContext, AppContext } from "./AppContext";

const App = () => {
  const [htmlTitle, setHTMLTitle] = useState("");
  const [title, setTitle] = useState("");
  //
  // Auth Context
  //
  const [auth, setAuth] = useState(defaultAuth);
  const authProviderValue = useMemo(() => ({ auth, setAuth }), [auth, setAuth]);
  //
  // App Context
  //
  const [app, setApp] = useState(defaultAppContext);
  const appProviderValue = useMemo(() => ({ app, setApp }), [app, setApp]);

  useEffect(() => {
    /*
    On initial app load (e.g. any reloads) check if there is a token 
      ? null 
      : set the authContext State to match the currently logged in user.
    */
    const token = localStorage.getItem("accessToken");

    if (token !== null) {
      setAuth({
        ...auth,
        isAuthenticated: true,
        isLoggedIn: true,
        token: token,
        user: JSON.parse(localStorage.getItem("user") || null),
      });
    }
  }, []);

  // useEffect(() => {
  //   /*
  //   On any auth change

  //   */
  //   if (auth.isAuthenticated === true && auth.refreshTokenIntervalId === null) {
  //     auth.refreshTokenIntervalId = setInterval(
  //       () => checkRefreshInterval(auth, setAuth, history),
  //       3000,
  //     );
  //   }
  //   return () => {
  //     /*
  //     When App Component unmounts - clear the refresh interval
  //     */
  //     try {
  //       clearInterval(auth.refreshTokenIntervalId);
  //     } catch (e) {}
  //   };
  // }, [auth]);

  return (
    <BrowserRouter history={history}>
      <div>
        <AppContext.Provider value={appProviderValue}>
          <AuthContext.Provider value={authProviderValue}>
            <div
              className="grid-sidebar"
              style={{
                zIndex: app.showLoginModal === true ? "50" : "initial",
              }}
            >
              <SidebarNav />
            </div>

            <Segment basic id="MainContent" textAlign="center">
              <Switch>
                <Route path="/home" exact render={(props) => <h1>Home</h1>} />

                <PrivateRoute
                  exact
                  path="/yardsales"
                  component={<Yardsales setTitle={setTitle} />}
                />
                <Route
                  path="/login"
                  exact
                  render={(props) => (
                    <LoginModal forcedOpen={true} {...props} />
                  )}
                />

                <Route
                  exact
                  path="/request-change-password"
                  render={(props) => <ForgotPasswordModal {...props} />}
                />

                <Route
                  path="/register"
                  render={(props) => (
                    <RegisterModal defaultOpen={true} {...props} />
                  )}
                />

                <Route
                  path="/confirm-change-password/:resetCode/:uuid"
                  render={(props) => (
                    <ConfirmNewPasswordModalBody
                      defaultOpen={true}
                      {...props}
                    />
                  )}
                />
                <Route
                  exact
                  path="/register/confirm-email"
                  render={(props) => (
                    <RegistrationConfirmationModal
                      {...props}
                      defaultOpen={true}
                      forcedOpen={true}
                    />
                  )}
                />
                <Route
                  path="/404"
                  render={(props) => <NotFoundPage {...props} />}
                />
                {/* <Redirect to="/404" /> */}
              </Switch>
            </Segment>
          </AuthContext.Provider>
        </AppContext.Provider>
      </div>
    </BrowserRouter>
  );
};

export default App;

const TestYardsales = () => {
  const { auth, setAuth } = useContext(AuthContext);

  return (
    <div>
      <h2>Yardsales</h2>
      <p>{JSON.stringify(auth)}</p>
    </div>
  );
};
