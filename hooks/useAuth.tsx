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

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loginForm, setLoginForm] = useState(initialLoginFormValues);
  const [formErrorMessage, setFormErrorMessage] = useState(null);

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
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loginForm,
        formErrorMessage,
        handleLoginFormChange,
        tryAuthenticateWithEmailPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const {
    isAuthenticated,
    loginForm,
    handleLoginFormChange,
    tryAuthenticateWithEmailPassword,
    logout,
    formErrorMessage,
  } = useContext(AuthContext);
  return {
    isAuthenticated,
    loginForm,
    formErrorMessage,
    handleLoginFormChange,
    tryAuthenticateWithEmailPassword,
    logout,
  };
};
