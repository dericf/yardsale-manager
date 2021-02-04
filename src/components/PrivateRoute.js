import React, { useEffect } from "react";
import { Route, withRouter, Redirect } from "react-router-dom";
// import { useAuth0 } from "../react-auth0-spa";

import LoginModal from "./modals/LoginModal/LoginModal";

import { BASE_URL } from "../constants";
import { AuthContext, defaultAuth } from "../AuthContext";
import { AppContext } from "../AppContext";

import { refreshAccessToken, tokenIsExpired } from "../AuthContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  let { auth, setAuth } = React.useContext(AuthContext);
  let { app, setApp } = React.useContext(AppContext);

  const loading = false;

  // useEffect(() => {
  //   // if (!auth.isAuthenticated) {
  //   //   return <Redirect to="/login" />;
  //   // }
  //   setAuth({ ...auth, loading: false });

  //   const token = localStorage.getItem("accessToken");
  //   if (token && tokenIsExpired(token)) {
  //     //
  //     // Token is valid (TODO: do other checks here)
  //     //
  //     refreshAccessToken(token);
  //   }

  //   const fn = async () => {
  //     // await loginWithRedirect({
  //     //   appState: { targetUrl: path }
  //     // });
  //   };
  //   fn();
  // }, [loading, auth.isAuthenticated, path]);
  return (
    <Route
      {...rest}
      render={(props) => {
        !!auth.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={"/login"} />
        );
      }}
    />
  );
};

export default withRouter(PrivateRoute);
