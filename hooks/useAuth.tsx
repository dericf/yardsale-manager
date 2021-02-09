import jwtDecode from "jwt-decode";
import React, { useState, useContext, createContext } from "react";
import {
  ConfirmResetPassword,
  GenericResponse,
  LoginResponse,
  RegisterResponse,
} from "../types/RequestResponse";
import { useAlert } from "./useAlert";
import { useIsLoading } from "./useIsLoading";
import { AuthContextInterface } from "../types/Context";
import { LoginForm, RegisterForm, ResetPasswordForm } from "../types/Forms";

const initialLoginFormValues = {
  email: "",
  password: "",
} as LoginForm;

const initialRegistrationFormValues = {
  name: "",
  initials: "",
  email: "",
  password: "",
  confirmPassword: "",
} as RegisterForm;

const initialResetPasswordFormValues = {
  password: "",
  confirmPassword: "",
} as ResetPasswordForm;

// export const initialAuthContextValue = {
//   isAuthenticated: null,
//   token: null,
//   refreshToken: null,
//   user: null,
//   loginForm: initialLoginFormValues,
//   registerForm: initialRegistrationFormValues,
//   formErrorMessage: null,
//   tryAuthenticateWithEmailPassword: (_, __) => {},
//   handleLoginFormChange: (_, __) => {},
//   logout: () => {},
// } as AuthContextInterface;

export const AuthContext = createContext<AuthContextInterface>({} as AuthContextInterface);

export default function AuthProvider({ children }) {
  const { loadingState, setLoadingState, clearLoadingState } = useIsLoading();
  const { sendAlert, sendError } = useAlert();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const [loginForm, setLoginForm] = useState<LoginForm>(initialLoginFormValues);
  const [registerForm, setRegisterForm] = useState<RegisterForm>(
    initialRegistrationFormValues,
  );

  const [resetPasswordForm, setResetPasswordForm] = useState<ResetPasswordForm>(
    initialResetPasswordFormValues,
  );

  const [formErrorMessage, setFormErrorMessage] = useState(null);

  const handleRegisterFormChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target: HTMLInputElement = e.currentTarget;
    let val = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    // Set the initials if the name is being changed
    let computedInitials = null;
    if (name === "name") {
      computedInitials = String(
        String(val)
          .split(" ")
          .map((name) => name[0]),
      ).replace(",", "");
    }

    setRegisterForm({
      ...registerForm,
      [name]: val,
      initials: computedInitials ? computedInitials : registerForm.initials,
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
    try {
      localStorage?.removeItem("accessToken");
      localStorage?.removeItem("refreshToken");
      localStorage?.removeItem("user");
    } catch (error) {
      console.log("Error", error);
    }

    setIsAuthenticated(false);
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const tryRegisterUser = async (): Promise<boolean> => {
    let uri = `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/register`;
    let data = {
      name: registerForm.name,
      initials: registerForm.initials,
      email: registerForm.email,
      password: registerForm.password,
      confirmPassword: registerForm.confirmPassword,
    } as RegisterForm;
    let options = {
      method: "POST",
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    } as RequestInit;

    try {
      const resp = await fetch(uri, options);
      const json: RegisterResponse = await resp.json();
      if (json.STATUS === "OK") {
        sendAlert(
          "Success! Your account has been registered. Check your email for a confirmation link.",
        );
        return true;
      } else if (json.STATUS === "ERROR") {
        sendError(json.MESSAGE);
        return false;
      }
    } catch (error) {
      sendError("There was a problem on our end. Please try again later.");
      return false;
    }
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
    } as RequestInit;
    console.log("Getting a new access token");
    fetch(uri, options)
      .then((res) => res.json())
      .then((json) => {
        if (json.STATUS === "OK" && json.newToken && json.newToken !== "") {
          //
          // Success
          //

          setIsAuthenticated(true);
          localStorage.setItem("accessToken", json.newToken);
          setToken(json.newToken);
          // Keep the same refresh token, don't reset the refresh token every time
          // localStorage.setItem("refreshToken", json.newRefreshToken);
          // setRefreshToken(json.newRefreshToken);
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

  const requestNewPassword = async () => {};

  const resetUserPassword = async (
    password,
    confirmPassword,
    resetCode,
    uuid,
  ): Promise<boolean> => {
    let uri = `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/complete-change-password`;
    let data = {
      new_password: resetPasswordForm.password,
      confirm_new_password: resetPasswordForm.confirmPassword,
      reset_code: resetCode,
      uuid: uuid,
    };
    // let options =

    try {
      const resp = await fetch(uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": "true",
        },
        body: JSON.stringify(data),
      });

      // console.log("Login Response is: ", res)
      const json: ConfirmResetPassword = await resp.json();

      // console.log('JSON: ', json)
      if (json.STATUS === "OK") {
        return true;
      } else if (json.STATUS === "ERROR") {
        if (json.MESSAGE === "User not found") {
          sendError("No user was found matching that email. Please try again.");
        } else if (json.MESSAGE === "Reset code does not match") {
          sendError("Password does not match. Please try again.");
        } else if (json.MESSAGE === "Passwords do not match") {
          sendError("Passwords do not match. Please try again.");
        }
        return false;
      }
    } catch (err) {
      // console.log('ERROR', err)
      sendError("There was a problem on our end. Please try again later.");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={
        {
          user,
          token,
          refreshToken,
          isAuthenticated,
          loginForm,
          registerForm,
          formErrorMessage,
          handleLoginFormChange,
          handleRegisterFormChange,
          tryAuthenticateWithEmailPassword,
          tryRegisterUser,
          loadAuthStateFromLocalStorage,
          logout,
          isTokenExpired,
          refreshNewAccessToken,
        } as AuthContextInterface
      }
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext<AuthContextInterface>(AuthContext);
  return ctx;
};
