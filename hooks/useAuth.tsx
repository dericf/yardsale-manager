import jwtDecode from "jwt-decode";
import React, { useState, useContext, createContext } from "react";
import { LoginResponse } from "../types/RequestResponse";
import { useAlert } from "./useAlert";
import { useIsLoading } from "./useIsLoading";

interface LoginForm {
  email: string;
  password: string;
}

const initialLoginFormValues: LoginForm = {
  email: "",
  password: "",
};

const initialRegistrationFormValues = {
  name: "",
  initials: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const initialAuthContextValue = {
  isAuthenticated: null,
  token: null,
  refreshToken: null,
  user: null,
  loginForm: initialLoginFormValues,
  registrationForm: initialRegistrationFormValues,
  formErrorMessage: null,
  tryAuthenticateWithEmailPassword: (_, __) => {},
  handleLoginFormChange: (_, __) => {},
  refreshAuthToken: () => {},
  logout: () => {},
};

export const AuthContext = createContext(initialAuthContextValue);

export default function AuthProvider({ children }) {
  const { loadingState, setLoadingState, clearLoadingState } = useIsLoading();
  const { sendAlert, sendError } = useAlert();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const [loginForm, setLoginForm] = useState(initialLoginFormValues);
  const [registerForm, setRegisterForm] = useState(
    initialRegistrationFormValues,
  );

  const [formErrorMessage, setFormErrorMessage] = useState(null);

  const handleRegisterFormChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target: HTMLInputElement = e.currentTarget;
    const val = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setRegisterForm({
      ...registerForm,
      [name]: val,
    });
  };

  const handleLoginFormChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target: HTMLInputElement = e.currentTarget;
    const val = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setLoginForm({
      ...loginForm,
      [name]: val,
    });
  };

  const tryAuthenticateWithEmailPassword = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    setLoadingState({
      text: "loading",
      overlay: false,
      isLoading: true,
    });
    try {
      const res: Response = await fetch(
        `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Credentials": "true",
          },
          body: JSON.stringify({ email, password }),
        },
      );
      if (res.status >= 200 && res.status < 300) {
        const json: LoginResponse = await res.json();

        if (
          json.STATUS === "OK" &&
          json.token !== "" &&
          json.refreshToken != ""
        ) {
          //
          // TODO: This should be changed to not use localStorage eventually
          //
          setToken(json.token);
          setRefreshToken(json.refreshToken);
          setUser(json.user);
          localStorage.setItem("accessToken", json.token);
          localStorage.setItem("refreshToken", json.refreshToken);
          localStorage.setItem("user", JSON.stringify(json.user));
          setIsAuthenticated(true);
          sendAlert("You have been logged in");
          clearLoadingState();
          setLoginForm(initialLoginFormValues);
          return true;
        } else if (json.STATUS === "ERROR") {
          // console.log('Bad Login Credentials', json)
          if (json.MESSAGE === "User not found") {
            sendError(
              "No user was found matching that email. Please try again.",
            );
            clearLoadingState();
            return false;
          } else if (json.MESSAGE === "Wrong password") {
            sendError("Password does not match. Please try again.");

            clearLoadingState();
            // console.log('Bad password', json)
            return false;
          } else if (json.MESSAGE === "Email not confirmed") {
            sendError(
              "The email associated with this account has not been confirmed yet. Please check your email and follow the link provided and then log in again.",
            );
            setIsAuthenticated(false);
            clearLoadingState();
            return false;
          }
        }
      } else {
        // Some other error
        setIsAuthenticated(false);
        sendError("Something went wrong on our end. Please try again.");
        clearLoadingState();
        return false;
      }
    } catch (error) {
      setIsAuthenticated(false);
      sendError("Something went wrong on our end. Please try again.");
      clearLoadingState();
      return false;
    }
  };

  const logout = () => {
    // TODO:  Remove all auth tokens
    setIsAuthenticated(false);
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const loadAuthStateFromLocalStorage = async (): Promise<boolean> => {
    try {
      const cachedToken = localStorage?.getItem("accessToken");
      const cachedRefreshToken = localStorage?.getItem("refreshToken");
      const cachedUser = JSON.parse(localStorage?.getItem("user"));
      const isExpired = await isTokenExpired(cachedToken);
      if (isExpired === true) {
        const sessionStillOk = await refreshNewAccessToken(cachedRefreshToken);
        if (sessionStillOk === true) {
          return true;
        }
        return false;
      } else {
        //
        // It hasn't been long - primary token is still valid
        //
        setIsAuthenticated(true);
        setToken(cachedToken);
        setRefreshToken(cachedRefreshToken);
        setUser(cachedUser);
        return true;
      }
    } catch (error) {
      console.log("Error ");
      console.log(error);
      return false;
    }
  };

  const isTokenExpired = async (token: string): Promise<boolean> => {
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

  const refreshNewAccessToken = async (
    refreshToken: string,
  ): Promise<boolean> => {
    let returnValue = null;
    const uri = `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/refresh`;
    const options = {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: refreshToken }),
    };

    fetch(uri, options)
      .then((res) => res.json())
      .then((json) => {
        if (json.STATUS === "OK" && json.newToken && json.newToken !== "") {
          //
          // Success
          //

          setIsAuthenticated(true);
          localStorage.setItem("accessToken", json.newToken);
          localStorage.setItem("refreshToken", json.newRefreshToken);
          setToken(json.newToken);
          setRefreshToken(json.newRefreshToken);
          returnValue = true;
        } else if (
          json.STATUS == "ERROR" &&
          json.MESSAGE == "refresh token expired"
        ) {
          //
          // Error
          //
          setIsAuthenticated(false);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          returnValue = false;
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loginForm,
        formErrorMessage,
        handleLoginFormChange,
        tryAuthenticateWithEmailPassword,
        logout,
        loadAuthStateFromLocalStorage,
        handleRegisterFormChange,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    loginForm,
    handleLoginFormChange,
    tryAuthenticateWithEmailPassword,
    logout,
    loadAuthStateFromLocalStorage,
    formErrorMessage,
    handleRegisterFormChange,
  } = useContext(AuthContext);
  return {
    user,
    isAuthenticated,
    loginForm,
    formErrorMessage,
    handleLoginFormChange,
    tryAuthenticateWithEmailPassword,
    logout,
    loadAuthStateFromLocalStorage,
    handleRegisterFormChange,
  };
};
