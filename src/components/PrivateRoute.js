


import React, { useEffect } from "react";
import { Route, withRouter } from "react-router-dom";
// import { useAuth0 } from "../react-auth0-spa";

import LoginModal from './modals/LoginModal/LoginModal'

import { BASE_URL } from '../constants'
import { AuthContext } from '../App'

const jwtDecode = require('jwt-decode');

const refreshAccessToken = (auth, setAuth, history) => {
  let uri = `${BASE_URL}/auth/refresh`
  let data = {
    refreshToken: localStorage.getItem('refreshToken')
  }
  let options = {
    method: "POST",
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data)
  }

  fetch(
    uri,
    options
  ).then(res => (
    res.json()
  )).then(json => {
    if (json.STATUS === 'OK' && json.newToken && json.newToken !== "") {
      localStorage.setItem('accessToken', json.newToken)
    } else if (json.STATUS == 'ERROR' && json.MESSAGE == 'refresh token expired') {
      setAuth(auth => ({ ...auth, reAuthenticateRequired: true }))
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      history.push('/login')
    }
  })
}

const PrivateRoute = ({ component: Component, path, ...rest }) => {
  // const { loading, isAuthenticated, loginWithRedirect } = useAuth0();
  let { auth, setAuth } = React.useContext(AuthContext)

  // TEMPORARY: Overriding for prototyping
  const loading = false
  const isAuthenticated = false
  useEffect(() => {
    setAuth({ ...auth, loading: true })
    if (localStorage.getItem('accessToken') == 'undefined') {
      rest.history.push('/login')
    }
    //
    // Don't do any auth checks if user is already on the login page.
    //
    if (path === '/login' || path === '/register') {
      setAuth({ ...auth, loading: false })
      return;
    }
    let token = localStorage.getItem('accessToken')
    if (!token || typeof token === 'undefined') {
      rest.history.push('/login')
    } else {
      let jwt = jwtDecode(token)
      if (typeof jwt.exp === 'undefined') {
        // console.log('ERROR! TOKEN NEVER EXPIRES! ')
      }

      //
      // Check if token is expired
      //
      let current_time = Date.now().valueOf() / 1000;
      if (jwt.exp < current_time) {
        // Expired
        // console.log('TOKEN IS EXPIRED!')
        refreshAccessToken(auth, setAuth, rest.history)
      }
      //
      // Token is valid (TODO: do other checks here)
      //
      setAuth({ ...auth, isAuthenticated: true, loading: false })
    }
    const fn = async () => {
      // await loginWithRedirect({
      //   appState: { targetUrl: path }
      // });
    };
    fn();
  }, [loading, auth.isAuthenticated, path]);

  const render = props => auth.isAuthenticated === true ? <Component {...props} /> : <LoginModal defaultOpen={true} forcedOpen={true} />;

  return <Route path={path} render={render} {...rest} />;
};

export default withRouter(PrivateRoute);
