import { ApolloClient } from "@apollo/client";
import React from "react";
import { FormValues } from "../hooks/useForm";
import { LoginForm, RegisterForm } from "./Forms";
import { UseQueryResponse } from "./GraphQL";
import { User } from "./User";
import { YardSalesInterface } from "./YardSales";
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
  resetUserPassword: (
    password: string,
    confirmPassword: string,
    resetCode: string,
    uuid: string,
  ) => Promise<boolean>
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


export interface Filter {
	searchText: string
}
export interface HasuraContextInterface {
  context: any,
  query: (q: string, variables?: any) => any,
  mutation: (q: string, variables?: any) => any
}

export interface YardSalesContextInterFace {
  // TODO hook this array type up to graphql types
  yardSales: Array<YardSalesInterface>;
  setYardSales;
  selectedYardSale: string;
  createNewYardsale: (yardsale: FormValues) => any
  updateYardSales: () => Promise<UseQueryResponse>;
	updateFilterText: (text: string) => void;
	filter: Filter;
}