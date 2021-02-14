// https://hasura.io/learn/graphql/nextjs-fullstack-serverless/queries/2-create-query/
import { useState, useContext, useEffect, createContext } from "react";
import {
  GET_SELLERS,
  GET_SELLER_LINKS_FOR_SELLER,
  GET_TRANSACTION_ITEMS_FOR_SELLER,
  GET_YARDSALES,
} from "../graphql/queries";
import {
  CREATE_SELLER,
  CREATE_YARDSALE,
  DELETE_SELLER,
  DELETE_YARDSALE,
  UPDATE_SELLER,
  UPDATE_YARDSALE,
} from "../graphql/mutations";
import React from "react";
import { useQuery } from "@apollo/client";
import HasuraProvider, { useHasura } from "./useHasura";
import { UseQueryResponse } from "../types/GraphQL";
import { Filter, SellersContextInterFace } from "../types/Context";
import { YardSalesInterface } from "../types/YardSales";
import { useAuth } from "./useAuth";
import { FormValues } from "./useForm";
import { SellersInterface } from "../types/Sellers";
import { useAlert } from "./useAlert";
import { UUID } from "../types/General";
import { SellersSortByOptions } from "../types/DropdownOptions";

/*
gq https://localhost:8080/v1/graphql  -H "X-Hasura-Admin-Secret: D091hnLASK-1shf-1OSIHF92!1ilksdfh01" --introspect > schema.graphql
gq https://localhost:8080/v1/graphql -H "X-Hasura-Admin-Secret: D091hnLASK-1shf-1OSIHF92!1ilksdfh01" --introspect --format json > schema.json
*/

export const SellersContext = createContext<SellersContextInterFace>(
  {} as SellersContextInterFace,
);

export default function SellersProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const { query, mutation } = useHasura();
  const { sendError, sendAlert, sendInfo } = useAlert();

  const [sellers, setSellers] = useState(new Array<SellersInterface>());
  const [selectedSeller, setSelectedSeller] = useState<SellersInterface>(null);
  // const { client } = useHasura();

  const [sellerLinks, setSellerLinks] = useState(new Array<any>());
  const [sellerTransactions, setSellerTransactions] = useState(
    new Array<any>(),
  );

  const [filter, setFilter] = useState<Filter>({
    searchText: "",
    sortBy: SellersSortByOptions[0],
  });

  // useEffect(() => {
  //   updateYardSales();
  // }, []);

  const updateFilterText = (newText: string) => {
    // Deprecated
    setFilter({ ...filter, searchText: newText });
  };

  const updateSellers = async (): Promise<UseQueryResponse> => {
    // Make query to update all sellers for this user
  
    const sortBy = {
      name: filter?.sortBy?.value?.split("-")[0],
      direction: filter?.sortBy?.value?.split("-")[1],
    };
    const data = await query(GET_SELLERS(sortBy.name, sortBy.direction));
    // Set state
    setSellers(data.seller);
    return {
      data: data.seller,
      loading: false,
      error: false,
    } as UseQueryResponse;
  };

  const createNewSeller = async (seller) => {
    // Todo: refactor to use mutation
    const responseData = await query(CREATE_SELLER, seller);
    return responseData;
  };

  const updateSeller = async (seller) => {
    // post to graphql -> mutation insertSeller
    const responseData = await query(UPDATE_SELLER, seller);
    return responseData;
  };

  const deleteSeller = async (sellerId: UUID): Promise<UseQueryResponse> => {
    // TODO: Check if this seller already has transactions
    const { data: transactionsResponse } = await getAllTransactionsForSeller(
      sellerId,
    );
    if (transactionsResponse?.transaction?.length > 0) {
      sendError(
        "Cannot delete a seller that has linked historical transactions.",
      );
      return { data: {} };
    } else {
      const responseData = await query(DELETE_SELLER, { sellerUUID: sellerId });
      sendAlert("Successfully deleted seller");
      setSellers({ ...sellers.filter((s) => s.uuid !== sellerId) });
      return responseData;
    }
  };

  const getAllTransactionsForSeller = async (
    sellerId: UUID,
  ): Promise<UseQueryResponse> => {
    const data = await query(GET_TRANSACTION_ITEMS_FOR_SELLER, {
      sellerUUID: sellerId,
    });
    setSellerTransactions(data.transaction);
    return { data: data.transaction };
  };

  const getAllLinksForSeller = async (
    sellerId: UUID,
  ): Promise<UseQueryResponse> => {
    const data = await query(GET_SELLER_LINKS_FOR_SELLER, {
      sellerUUID: sellerId,
    });
    setSellerLinks(data.yardsale_seller_link);
    return { data: data.yardsale_seller_link };
  };

  useEffect(() => {
    if (filter && isAuthenticated === true) {
      (async() => (
        await updateSellers()
      ))()
    }
  }, [filter, isAuthenticated])

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
        setFilter,
        createNewSeller,
        deleteSeller,
        getAllTransactionsForSeller,
        getAllLinksForSeller,
        sellerLinks,
        sellerTransactions,
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
