import { ApolloClient } from "@apollo/client";
import React from "react";
import { FormValues } from "../hooks/useForm";
import { LoginForm, RegisterForm } from "./Forms";
import { UUID } from "./General";
import { UseQueryResponse } from "./GraphQL";
import { SellersInterface } from "./Sellers";
import { Transaction } from "./Transaction";
import { User } from "./User";
import { YardSaleLinks } from "./YardSaleLinks";
import { YardSalesInterface } from "./YardSales";
// TODO: Add user Context

type StateSetterFunction = (name: string) => number;
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
  ) => Promise<boolean>;
  isTokenExpired: (token: string) => Promise<boolean>;
  refreshNewAccessToken: (refreshToken: string) => Promise<boolean>;
}

export interface LoadingContextInterface {
  loadingState: LoadingState;
  setLoadingState: (_: LoadingState) => void;
  clearLoadingState: () => void;
}

export interface LoadingState {
  isLoading: boolean;
  text: string;
  overlay: boolean;
}

export interface Filter {
  searchText: string;
}
export interface HasuraContextInterface {
  context: any;
  query: (q: string, variables?: any) => any;
  mutation: (q: string, variables?: any) => any;
}

export interface YardSalesContextInterFace {
  // TODO hook this array type up to graphql types
  yardSales: Array<YardSalesInterface>;
  setYardSales;
  sellerLinks: Array<YardSaleLinks>;
  transactionItems: Array<Transaction>;
  selectedYardSale: YardSalesInterface;
  setSelectedYardSale: (_: YardSalesInterface) => void;
  clearSelectedYardSale: () => void;
  createNewYardsale: (yardsale: FormValues) => any;
  updateYardsale: (yardsale: FormValues) => any;
  updateYardSales: () => Promise<UseQueryResponse>;
  getYardSaleById: (yardSaleId: UUID) => Promise<UseQueryResponse>
  updateFilterText: (text: string) => void;
  deleteYardSale: (yardSaleId: string) => Promise<UseQueryResponse>;
  filter: Filter;
  // Seller Links
  deleteYardSaleSellerLink: (linkId: UUID) => Promise<any>;
  getAllYardSaleSellerLinks: (yardSaleId: UUID) => Promise<any>;
  createYardSaleSellerLink: (sellerId: UUID,yardSaleId: UUID) =>  Promise<any>;
  getSellersCanBeAdded: (allSellers: Array<SellersInterface>, existingSellerLinks: Array<YardSaleLinks>) => Array<SellersInterface>;
  getAllYardSaleTransactions: (yardSaleId: UUID) => Promise<any>;
  createYardSaleTransaction: (yardSaleId: UUID, transactionItem: Transaction) => Promise<any>;
}


export interface SellersContextInterFace {
  // TODO hook this array type up to graphql types
  sellers: Array<SellersInterface>;
  setSellers;
  selectedSeller: SellersInterface;
  setSelectedSeller: (_: SellersInterface) => void;
  createNewSeller: (seller: FormValues) => any;
  updateSeller: (seller: FormValues) => any;
  updateSellers: () => Promise<UseQueryResponse>;
  updateFilterText: (text: string) => void;
  deleteSeller: (sellerId: string) => Promise<UseQueryResponse>;
  filter: Filter;
}
