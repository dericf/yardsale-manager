import React, { Component, Fragment, useState, useContext } from "react";

import { Router, Route, Switch } from "react-router-dom";

// styles
import "./App.css";
import {
  Container,
  Grid,
  Header,
  Divider,
  Button,
  Segment
} from 'semantic-ui-react';

import Notifications, { notify } from 'react-notify-toast';

import history from "./utils/history";

import 'semantic-ui-css/semantic.min.css';
import "react-datepicker/dist/react-datepicker.css";

import PrivateRoute from "./components/PrivateRoute";

import Loading from "./components/layout/Loading";
import Title from './components/layout/Title';
import TopNav from './components/layout/TopNav';
import Footer from './components/layout/Footer';
import Sellers from './pages/Sellers';
import Yardsales from './pages/Yardsales';
import Home from './pages/Home';

import './utils/prototypes'

import { NAVBAR_HEIGHT, FOOTER_HEIGHT } from './constants'

import { defaultFakeData } from './FakeData'

import { auth as defaultAuth } from './Auth'
import LoginModal from "./components/modals/LoginModal/LoginModal";
import RegisterModal from "./components/modals/RegisterModal/RegisterModal";

import { GET_USER } from './graphql/queries'
import { useQuery } from '@apollo/react-hooks';
import GetUserComp from './GetUser'

export const FakeDataContext = React.createContext([defaultFakeData, () => defaultFakeData])
export const AuthContext = React.createContext([defaultAuth, () => defaultAuth])

const App = () => {
  // const { loading } = useAuth0();
  const [title, setTitle] = useState('');

  const [fakeData, setFakeData] = useState(defaultFakeData)
  const [auth, setAuth] = useState(defaultAuth)
  // if (auth.loading) {
  //   return <Loading />;
  // }
  // Get User

  return (
    <Router history={history}>
      {/* Eventually remove this FakeDataContext */}
      <FakeDataContext.Provider value={{ fakeData, setFakeData }}>
        <AuthContext.Provider value={{ auth, setAuth }}>

          <Notifications options={{ zIndex: 20000, top: "85vh" }} />
          <TopNav />
          <GetUserComp />

          <Container as={Segment} fluid="true"
            id="MainContent"
            style={{ marginTop: `${NAVBAR_HEIGHT}rem`, marginBottom: `${FOOTER_HEIGHT}px` }}
          >
            <Grid>
              <Grid.Row className="p0 m0">
                <Title title={title} ></Title>
              </Grid.Row>
              <Grid.Row className="p0 m0" >
                <Grid.Column width={16} className="p0">
                  <Switch>
                    <PrivateRoute
                      exact
                      path="/"
                      render={props => <Home {...props} setTitle={setTitle} />}
                    />

                    <PrivateRoute
                      exact
                      path="/sellers"
                      render={props => <Sellers {...props} setTitle={setTitle} />}
                    />
                    <PrivateRoute
                      exact
                      path="/yardsales"
                      render={props => <Yardsales {...props} setTitle={setTitle} />}
                    />

                    <PrivateRoute
                      exact
                      path="/login"
                      render={props => <LoginModal {...props} defaultOpen={true} forcedOpen={true} />}
                    />

                    <PrivateRoute
                      exact
                      path="/register"
                      render={props => <RegisterModal {...props} defaultOpen={true} forcedOpen={true} />}
                    />
                  </Switch>

                </Grid.Column>
              </Grid.Row>
              <Grid.Row className="p0 m0" style={{ position: "fixed", bottom: 0, left: 0 }}>
                <Grid.Column width={16} className="p0" >
                  <Footer></Footer>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </AuthContext.Provider>
      </FakeDataContext.Provider>
    </Router>
  );
};

export default App;
