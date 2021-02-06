import React from "react";
import { User } from "./User";
// TODO: Add user Context
export interface AuthContextInterface {
  isAuthenticated: boolean;
  token: string;
  refreshToken: string;
  user: User;
  loginForm: LoginForm;
  registerForm: RegisterForm;
  formErrorMessage: string;
  tryAuthenticateWithEmailPassword: (
    email: string,
    password: string,
  ) => Promise<boolean>;
  handleLoginFormChange: (e: React.FormEvent<HTMLInputElement>) => void;
  handleRegisterFormChange: (e: React.FormEvent<HTMLInputElement>) => void;
  tryRegisterUser: () => Promise<boolean>;
  loadAuthStateFromLocalStorage: () => Promise<boolean>;
  logout: () => void;
}

export interface LoadingContextInterface {
  loadingState: LoadingState;
  setLoadingState: (_: LoadingState) => void;
  clearLoadingState: (_: LoadingState) => void;
}

export interface LoadingState {
  isLoading: boolean;
  text: string;
  overlay: boolean;
}
