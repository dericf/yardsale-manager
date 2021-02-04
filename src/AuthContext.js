import { createContext } from "react";
import { BASE_URL } from "./constants";

export const AuthContext = createContext(null);

// import { BASE_URL } from "./constants";

const jwtDecode = require("jwt-decode");

const defaultAuth = {
  isAuthenticated: false,
  isLoggedIn: false,
  loading: false,
  enableRefreshTokenCheck: false,
  refreshTokenIntervalId: null,
  reAuthenticateRequired: false,
  redirectToAfterLogin: null,
  token: null,
  user: null,

  login: (auth, setAuth) => {
    // console.log('Login User Here')
    return;
  },
  logout: (auth, setAuth, history) => {
    // console.log('Logout User Here')
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    try {
      clearInterval(auth.refreshTokenIntervalFunction);
    } catch (e) {}

    setAuth({
      ...auth,
      isAuthenticated: false,
      loading: false,
      user: null,
      refreshTokenIntervalFunction: null,
      token: null,
    });

    history.push("/login");
    return;
  },
};

const login = async (data, auth, setAuth) => {
  setLoading(true);
  let uri = `${BASE_URL}/auth/login`;

  // let options =

  fetch(uri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": "true",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      // console.log("Login Response is: ", res)
      return res.json();
    })
    .then((json) => {
      // console.log('JSON: ', json)
      if (
        json.STATUS === "OK" &&
        json.token !== "" &&
        json.refreshToken != ""
      ) {
        // TODO: This should be changed to not use localStorage eventually
        localStorage.setItem("accessToken", json.token);
        localStorage.setItem("refreshToken", json.refreshToken);
        setValues(initialValues);

        // setTimeout(() => {
        //   console.log('Refreshing JWT')
        //   setAuth({...auth, reAuthenticateRequired: true})
        // }, 2000);

        setAuth((auth) => ({
          ...auth,
          loading: false,
          reAuthenticateRequired: false,
          user: json.user,
        }));
        setLoading(false);
        closeModal(false);

        setTimeout(() => {
          if (json.user.has_completed_onboarding === false) {
            console.log(
              "ONBOARDING FALSE: ",
              json.user,
              json.user.has_completed_onboarding,
            );
            props.history.push("/welcome");
          } else {
            console.log(
              "ONBOARDING TRUE: ",
              json.user,
              json.user.has_completed_onboarding,
            );
            props.history.push("/yardsales");
          }
        }, 500);

        // window.location.assign('/yardsales')
        // window.location.assign(json.callback)
        //   closeModal();
      } else if (json.STATUS === "ERROR") {
        // console.log('Bad Login Credentials', json)
        if (json.MESSAGE === "User not found") {
          // console.log('User not found', json)
          setAuth((auth) => ({
            ...auth,
            loading: false,
            reAuthenticateRequired: false,
          }));
          setLoading(false);
          // setValues(prev => ({ ...prev, email: "" }))
          autoFocusRef.current.focus();
          setErrorMessage(
            "No user was found matching that email. Please try again.",
          );
        } else if (json.MESSAGE === "Wrong password") {
          setErrorMessage("Password does not match. Please try again.");
          setAuth((auth) => ({
            ...auth,
            loading: false,
            reAuthenticateRequired: false,
          }));
          setLoading(false);
          // console.log('Bad password', json)
        } else if (json.MESSAGE === "Email not confirmed") {
          setErrorMessage(
            "The email associated with this account has not been confirmed yet. Please check your email and follow the link provided and then log in again.",
          );
          setAuth((auth) => ({
            ...auth,
            loading: false,
            reAuthenticateRequired: false,
          }));
          setLoading(false);
          // console.log('Email not confirmed', json)
        }
      }
    })
    .catch((err) => {
      // console.log('ERROR', err)
      setErrorMessage(
        "There was a problem on our end. Please try again later.",
      );
      setAuth((auth) => ({ ...auth, loading: false }));
      setLoading(false);
    });
};

const tokenIsExpired = (token) => {
  let jwt = jwtDecode(token);
  //
  // Check if token is expired
  //
  let current_time = Date.now().valueOf() / 1000;
  if (jwt.exp < current_time) {
    //
    // Token is Expired
    //
    return true;
  }
  return false;
};

const refreshAccessToken = (auth, setAuth, history) => {
  let returnValue = null;
  const uri = `${BASE_URL}/auth/refresh`;
  const data = {
    refreshToken: localStorage.getItem("refreshToken"),
  };
  const options = {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch(uri, options)
    .then((res) => res.json())
    .then((json) => {
      if (json.STATUS === "OK" && json.newToken && json.newToken !== "") {
        //
        // Success
        //
        localStorage.setItem("accessToken", json.newToken);
        returnValue = true;
      } else if (
        json.STATUS == "ERROR" &&
        json.MESSAGE == "refresh token expired"
      ) {
        //
        // Error
        //
        setAuth((auth) => ({ ...auth, reAuthenticateRequired: true }));
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        history.push("/login");
        return false;
      }
    })
    .catch((e) => {
      //
      // Something else went wrong
      //
      returnValue = false;
    });

  return returnValue;
};

const checkRefreshInterval = (auth, setAuth, history) => {
  const token = localStorage.getItem("accessToken");
  if (token === null) {
    setAuth(defaultAuth);
  }
  // console.log("Checking Token Expiry");
  // console.log("Token: ", token);
  // console.log("Is the token expired ? ", tokenIsExpired(token));
  if (tokenIsExpired(token)) {
    localStorage.setItem("accessToken", null); // Prevent a potential infinite loop with the setInterval
    console.log("Token is expired... refreshing token...");
    refreshAccessToken(auth, setAuth, history);
  }
};

export {
  defaultAuth,
  login,
  tokenIsExpired,
  checkRefreshInterval,
  refreshAccessToken,
};
