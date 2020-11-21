import React, {
  Component,
  Fragment,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";

import { Router, Route, Switch, Redirect, Link } from "react-router-dom";

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

// import PrivateRoute from "./components/PrivateRoute";

import Loading from "./components/layout/Loading";
// import Title from "./components/layout/Title";
// import Footer from "./components/layout/Footer";
// import Sellers from "./pages/Sellers";
// import Yardsales from "./pages/Yardsales";
// import Home from "./pages/Home";
// import Onboarding from "./pages/Onboarding";
// import Market from "./pages/Market";
// import ForgotPasswordModal from "./components/modals/ForgotPasswordModal/ForgotModalPassword";

// import "./utils/prototypes";

// import { NAVBAR_HEIGHT, FOOTER_HEIGHT, TITLE_HEIGHT } from "./constants";

import {
  AuthContext,
  defaultAuth,
  tokenIsExpired,
  checkRefreshInterval,
} from "./AuthContext";
import LoginModal from "./components/modals/LoginModal/LoginModal";
// import RegistrationConfirmationModal from "./components/modals/RegistrationConfirmationModal/RegistrationConfirmationModal";
// import RegisterModal from "./components/modals/RegisterModal/RegisterModal";
// import NotFoundPage from "./pages/NotFoundPage";

// import { GET_USER } from "./graphql/queries";
// import { useQuery } from "@apollo/react-hooks";

// import TopNotifications from "./utils/Notifications";
// import Login from "./pages/Login";
// import SidebarNav from "./components/layout/SidebarNav";
// import ConfirmNewPasswordModalBody from "./components/modals/ForgotPasswordModal/ConfirmNewPasswordModalBody";
// import BottomNavBar from "./components/layout/Footer";
import TestHomePage from "./TestHomePage";
import { Button } from "semantic-ui-react";

const App = () => {
  // const [title, setTitle] = useState("");
  // const [app, setApp] = useState(defaultAppContext);

  const [auth, setAuth] = useState(defaultAuth);
  const providerValue = useMemo(() => ({ auth, setAuth }), [auth, setAuth]);

  useEffect(() => {
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

  useEffect(() => {
    if (
      auth.isAuthenticated === true &&
      auth.refreshTokenIntervalFunction === null
    ) {
      auth.refreshTokenIntervalFunction = setInterval(
        () => checkRefreshInterval(auth, setAuth, history),
        3000,
      );
    }
    return () => {
      try {
        clearInterval(auth.refreshTokenIntervalFunction);
      } catch (e) {}
    };
  }, [auth]);

  return (
    <Router history={history}>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/yardsales">Yardsales</Link>
            </li>
            <li></li>
          </ul>
        </nav>

        <AuthContext.Provider value={providerValue}>
          {auth && auth.isLoggedIn && (
            <>
              <pre>{JSON.stringify(auth.user)}</pre>
              <Route path="/" exact component={TestHomePage} />
              <Route path="/yardsales" exact component={TestYardsales} />
              <Route
                path="/login"
                exact
                component={() => <LoginModal forcedOpen={true} />}
              />
            </>
          )}

          {!auth.isLoggedIn && (
            <LoginModal
              trigger={() => (
                <Button onClick={() => auth.logout(auth, setAuth, history)}>
                  Logout
                </Button>
              )}
              forcedOpen={true}
            />
          )}
          {auth.user && (
            <Button onClick={() => auth.logout(auth, setAuth, history)}>
              Logout
            </Button>
          )}
        </AuthContext.Provider>
      </div>
    </Router>
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
