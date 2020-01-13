import React, { Component, Fragment, useState, useContext } from "react";

import { Router, Route, Switch, Redirect, Link } from "react-router-dom";

// styles
import "./App.css";
import {
  Container,
  Grid,
  Header,
  Divider,
  Button,
  Segment,
  Menu,
  Icon,
  Dropdown,
  Portal
} from "semantic-ui-react";

import Notifications, { notify } from "react-notify-toast";

import history from "./utils/history";

// import 'semantic-ui-css/semantic.min.css';
import "../semantic/dist/semantic.css";
import "./index.css";
import "./App.scss";
// import 'semantic-ui-less/themes/flat/globals'

import "react-datepicker/dist/react-datepicker.css";

import PrivateRoute from "./components/PrivateRoute";

import Loading from "./components/layout/Loading";
import Title from "./components/layout/Title";
import TopNav from "./components/layout/TopNav";
import Footer from "./components/layout/Footer";
import Sellers from "./pages/Sellers";
import Yardsales from "./pages/Yardsales";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Market from "./pages/Market";
import ForgotPasswordModal from './components/modals/ForgotPasswordModal/ForgotModalPassword'

import "./utils/prototypes";

import { NAVBAR_HEIGHT, FOOTER_HEIGHT, TITLE_HEIGHT } from "./constants";

import { defaultFakeData } from "./FakeData";

import { auth as defaultAuth } from "./Auth";
import LoginModal from "./components/modals/LoginModal/LoginModal";
import RegistrationConfirmationModal from "./components/modals/RegistrationConfirmationModal/RegistrationConfirmationModal";
import RegisterModal from "./components/modals/RegisterModal/RegisterModal";
import NotFoundPage from "./pages/NotFoundPage";

import { GET_USER } from "./graphql/queries";
import { useQuery } from "@apollo/react-hooks";
import GetUserComp from "./GetUser";

import TopNotifications from "./utils/Notifications";
import Login from "./pages/Login";
import SidebarNav from "./components/layout/SidebarNav";
import ConfirmNewPasswordModalBody from "./components/modals/ForgotPasswordModal/ConfirmNewPasswordModalBody";

export const FakeDataContext = React.createContext([
  defaultFakeData,
  () => defaultFakeData
]);
export const AuthContext = React.createContext([
  defaultAuth,
  () => defaultAuth
]);

const defaultAppContext = {
  activePage: "",
  notifications: {
    show: false,
    dismiss: true,
    message: "This is a test notification",
    level: "info"
  },
  sidebar: {
    settingsPortalOpen: false
  },
  yardsalePage: {
    searchQuery: "",
    activeYardsaleUUID: null
  }
}

export const AppContext = React.createContext([
  defaultAppContext,
  () => defaultAppContext
]);

const App = () => {
  const [title, setTitle] = useState("");
  const [fakeData, setFakeData] = useState(defaultFakeData);
  const [auth, setAuth] = useState(defaultAuth);
  const [app, setApp] = useState(defaultAppContext)
  return (
    <Router history={history}>
      {/* Eventually remove this FakeDataContext */}
      <FakeDataContext.Provider value={{ fakeData, setFakeData }}>
        <AuthContext.Provider value={{ auth, setAuth }}>
        <AppContext.Provider value={{ app, setApp }}>
          <Notifications options={{ zIndex: 20000, top: "85vh" }} />

          <div className="wrapper">
            <div className="layout-notifications" id="TopNotificationBar">
              <TopNotifications />
            </div>
            <SidebarNav />
            <div className="layout-content">
              <Container as={Segment} fluid id="MainContent">
                <Grid>
                  {/* <Grid.Row
                    className="p0 m0"
                    verticalAlign="middle"
                    style={{ height: TITLE_HEIGHT }}
                  >
                    <Title title={title}></Title>
                  </Grid.Row> */}
                  <Grid.Row
                    className="p0 m0"
                    style={{
                      overflowY: "auto",
                      overflowX: "hidden",
                      height: "100vh"
                    }}
                  >
                    <Grid.Column width={16} className="p0">
                      <Switch>
                        <Route
                          exact
                          path="/"
                          render={props => (
                            <Home {...props} setTitle={setTitle} />
                          )}
                        />

                        <PrivateRoute
                          exact
                          path="/login"
                          render={props => (
                            <Login {...props} />
                          )}
                        />
                        {/* Onboarding */}
                        <PrivateRoute
                          exact
                          path="/welcome"
                          render={props => (
                            <Onboarding {...props} />
                          )}
                        />
                        {/* Market */}
                        <PrivateRoute
                          exact
                          path="/market"
                          render={props => (
                            <Market {...props} setTitle={setTitle} />
                          )}
                        />

                        <PrivateRoute
                          exact
                          path="/sellers"
                          render={props => (
                            <Sellers {...props} setTitle={setTitle} />
                          )}
                        />
                        <PrivateRoute
                          exact
                          path="/yardsales"
                          render={props => (
                            <Yardsales {...props} setTitle={setTitle} />
                          )}
                        />

                        <Route
                          exact
                          path="/request-change-password"
                          render={props => (
                            <ForgotPasswordModal {...props}  />
                          )}
                        />

                        <Route
                          exact
                          path="/confirm-change-password"
                          render={props => (
                            <ConfirmNewPasswordModalBody defaultOpen={true} {...props}  />
                          )}
                        />

                        

                        <PrivateRoute
                          exact
                          path="/register"
                          render={props => (
                            <RegisterModal
                              {...props}
                              defaultOpen={true}
                              forcedOpen={true}
                            />
                          )}
                        />

                        <Route
                          exact
                          path="/register/confirm-email"
                          render={props => (
                            <RegistrationConfirmationModal
                              {...props}
                              defaultOpen={true}
                              forcedOpen={true}
                            />
                          )}
                        />

                        <Route 
                        path="/404" 
                        render={props => (                            
                            <NotFoundPage
                              {...props}
                            />
                          )} />
                        <Redirect to="/404" />
                      </Switch>
                    </Grid.Column>
                  </Grid.Row>
                  {/* <Grid.Row
                    className="p0 m0"
                    style={{ position: "fixed", bottom: 0, left: 0 }}
                  >
                    <Grid.Column width={16} className="p0">
                      <Footer></Footer>
                    </Grid.Column>
                  </Grid.Row> */}
                </Grid>
              </Container>
            </div>
          </div>

          {/* <TopNav />
          <GetUserComp />

           */}
        </AppContext.Provider>
        </AuthContext.Provider>
      </FakeDataContext.Provider>
    </Router>
  );
};

export default App;
