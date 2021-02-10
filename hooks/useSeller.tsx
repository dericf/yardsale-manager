// https://hasura.io/learn/graphql/nextjs-fullstack-serverless/queries/2-create-query/
import { useState, useContext, useEffect, createContext } from "react";
import { GET_SELLERS, GET_YARDSALES } from "../graphql/queries";
import { CREATE_SELLER, CREATE_YARDSALE, DELETE_SELLER, DELETE_YARDSALE, UPDATE_SELLER, UPDATE_YARDSALE } from "../graphql/mutations";
import React from "react";
import { useQuery } from "@apollo/client";
import HasuraProvider, { useHasura } from "./useHasura";
import { UseQueryResponse } from "../types/GraphQL";
import { SellersContextInterFace } from "../types/Context";
import { YardSalesInterface } from "../types/YardSales";
import { useAuth } from "./useAuth";
import { FormValues } from "./useForm";
import { SellersInterface } from "../types/Sellers";



/*
gq https://localhost:8080/v1/graphql  -H "X-Hasura-Admin-Secret: D091hnLASK-1shf-1OSIHF92!1ilksdfh01" --introspect > schema.graphql
gq https://localhost:8080/v1/graphql -H "X-Hasura-Admin-Secret: D091hnLASK-1shf-1OSIHF92!1ilksdfh01" --introspect --format json > schema.json
*/

export const SellersContext = createContext<SellersContextInterFace>(
  {} as SellersContextInterFace,
);

export default function SellersProvider({ children }) {
  const { user } = useAuth();
  const { query, mutation } = useHasura();

  const [sellers, setSellers] = useState(
    new Array<SellersInterface>(),
  );
  const [selectedSeller, setSelectedSeller] = useState<SellersInterface>(null);
  // const { client } = useHasura();

  const [filter, setFilter] = useState({
    searchText: "",
  });

  // useEffect(() => {
  //   updateYardSales();
  // }, []);

  const updateFilterText = (newText: string) => {
    setFilter({ ...filter, searchText: newText });
  };

  const updateSellers = async (): Promise<UseQueryResponse> => {
    // Make query to update all sellers for this user
    const data = await query(GET_SELLERS);
    console.log("Response from query was:");
    setSellers(data.seller)
    console.log(data);
    return { data: data.seller, loading: false, error: false } as UseQueryResponse;
  };

  const createNewSeller = async (seller) => {
    // post to graphql -> mutation insertSeller
    const responseData = await query(CREATE_SELLER, seller);
    return responseData;
  };

  const updateSeller = async (seller) => {
    // post to graphql -> mutation insertSeller
    const responseData = await query(UPDATE_SELLER, seller);
    return responseData;
  };

  const deleteSeller = async (sellerId: string) => {
    // post to graphql -> mutation insertSeller
    const responseData = await query(DELETE_SELLER, {sellerUUID: sellerId});
    console.log("\n\nResponse from delete was..");
    console.log(responseData);
    setSellers({...sellers.filter(s => s.uuid  !== sellerId)})
    return responseData;
  };

  return (
    <SellersContext.Provider
      value={{
        sellers,
        setSellers,
        selectedSeller,
        setSelectedSeller,
        updateSellers,
        updateSeller,
        updateFilterText,
        filter,
        createNewSeller,
        deleteSeller
      }}
    >
      {children}
    </SellersContext.Provider>
  );
}

export const useSellers = () => {
  const ctx = useContext<SellersContextInterFace>(SellersContext);
  return ctx;
};
