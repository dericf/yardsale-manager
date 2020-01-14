import React, { Fragment, useEffect, useState, useContext } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  Segment,
  Grid,
  Divider,
  Loader,
  Dimmer,
  Container,
  Message,
  Header,
  Image,
  Icon,
  IconGroup
} from "semantic-ui-react";

import Loading from "../components/layout/Loading";
import LoadImage from "../assets/logo2.jpg";
import LoginModal from "../components/modals/LoginModal/LoginModal";
import { AppContext } from "../App";
import { auth } from "../Auth";
import Home from "./Home";

const Login = ({ ...props }) => {
  let { app, setApp } = React.useContext(AppContext);
  console.log('Login PATH: ', props.match.path)

  useEffect(() => {
    console.log('Login mounted')
  }, [])
  
  if (props.match.path == '/login') {
    if (app.showLoginModal !== true) {
      setApp({...app, showLoginModal: true})
    }
    return <Home {...props} />
  }
};

export default withRouter(Login);
