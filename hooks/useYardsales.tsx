// https://hasura.io/learn/graphql/nextjs-fullstack-serverless/queries/2-create-query/
import { useState, useContext, useEffect, createContext } from "react";
import { GET_YARDSALES } from "../graphql/queries";
import { CREATE_YARDSALE, UPDATE_YARDSALE } from "../graphql/mutations";
import React from "react";
import { useQuery } from "@apollo/client";
import HasuraProvider, { useHasura } from "./useHasura";
import { UseQueryResponse } from "../types/GraphQL";
import { YardSalesContextInterFace } from "../types/Context";
import { YardSalesInterface } from "../types/YardSales";
import { useAuth } from "./useAuth";
import { FormValues } from "./useForm";

interface ApolloQueryReturn {
  loading: boolean;
  error: any;
  data: [];
}

/*
gq https://localhost:8080/v1/graphql  -H "X-Hasura-Admin-Secret: D091hnLASK-1shf-1OSIHF92!1ilksdfh01" --introspect > schema.graphql
gq https://localhost:8080/v1/graphql -H "X-Hasura-Admin-Secret: D091hnLASK-1shf-1OSIHF92!1ilksdfh01" --introspect --format json > schema.json
*/

export const YardSalesContext = createContext<YardSalesContextInterFace>(
  {} as YardSalesContextInterFace,
);

export default function YardSalesProvider({ children }) {
  const { user } = useAuth();
  const { query } = useHasura();

  const [yardSales, setYardSales] = useState(
    new Array<YardSalesInterface>(),
  );
  const [selectedYardSale, setSelectedYardSale] = useState<YardSalesInterface>(null);
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

  const updateYardSales = async (): Promise<UseQueryResponse> => {
    // Make query to update all yardsales for this user
    const data = await query(GET_YARDSALES);
    console.log("Query...");
    setYardSales(data.yardsale)
    console.log(data);
    return { data: data.yardsale, loading: false, error: false } as UseQueryResponse;
  };

  const createNewYardsale = async (yardsale) => {
    // post to graphql -> mutation insertYardsale
    console.log(user?.initials);
    const responseData = await query(CREATE_YARDSALE, yardsale);
    return responseData;
  };

  const updateYardsale = async (yardsale) => {
    // post to graphql -> mutation insertYardsale
    const responseData = await query(UPDATE_YARDSALE, yardsale);
    return responseData;
  };

  return (
    <YardSalesContext.Provider
      value={{
        yardSales,
        selectedYardSale,
        setSelectedYardSale,
        updateYardSales,
        setYardSales,
        updateFilterText,
        filter,
        createNewYardsale,
        updateYardsale,
      }}
    >
      {children}
    </YardSalesContext.Provider>
  );
}

export const useYardsales = () => {
  const ctx = useContext<YardSalesContextInterFace>(YardSalesContext);
  return ctx;
};
