// https://hasura.io/learn/graphql/nextjs-fullstack-serverless/queries/2-create-query/
import { useState, useContext, useEffect, createContext } from "react";
import {
  GET_SELLER_LINKS_FOR_YARDSALE,
  GET_TRANSACTION_ITEMS_FOR_YARDSALE,
  GET_YARDSALE,
  GET_YARDSALES,
  GET_TRANSACTION_ITEMS_FOR_SELLER_ON_YARDSALE,
} from "../graphql/queries";
import {
  CREATE_TRANSACTION_ITEM,
  CREATE_YARDSALE,
  CREATE_YARDSALE_SELLER_LINK,
  DELETE_TRANSACTION_BY_UUID,
  DELETE_YARDSALE,
  DELETE_YARDSALE_SELLER_LINK,
  UPDATE_YARDSALE,
} from "../graphql/mutations";
import React from "react";
import HasuraProvider, { useHasura } from "./useHasura";
import { UseQueryResponse } from "../types/GraphQL";
import { Filter, YardSalesContextInterFace } from "../types/Context";
import { YardSalesInterface } from "../types/YardSales";
import { useAuth } from "./useAuth";
import { FormValues } from "./useForm";
import { SellersInterface } from "../types/Sellers";
import { UUID } from "../types/General";
import { YardSaleLinks } from "../types/YardSaleLinks";
import { PendingTransactionItem, Transaction } from "../types/Transaction";
import { YardSaleSortByOptions } from "../types/DropdownOptions";

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
  const { user, isAuthenticated } = useAuth();
  const { query, mutation } = useHasura();

  const [yardSales, setYardSales] = useState(new Array<YardSalesInterface>());
  const [selectedYardSale, setSelectedYardSale] = useState<YardSalesInterface | null>(
    null,
  );
  // const { client } = useHasura();
  const [sellerLinks, setSellerLinks] = useState(new Array<YardSaleLinks>());
  const [transactionItems, setTransactionItems] = useState(
    new Array<Transaction>(),
  );

  const initialFilterState: Filter = {
    searchText: "",
    sortBy: YardSaleSortByOptions[0]
    
  } 

  const [filter, setFilter] = useState<Filter>(initialFilterState);

  // useEffect(() => {
  //   updateYardSales();
  // }, []);

  const updateFilterText = (newText: string) => {
    setFilter({ ...filter, searchText: newText });
  };

  const getYardSaleById = async (
    yardSaleId: UUID,
  ): Promise<UseQueryResponse> => {
    if (!yardSaleId) {
      return { data: null, loading: false, error: true };
    }
    const data = await query(GET_YARDSALE, {
      yardsaleUUID: yardSaleId,
    });
    return {
      data: data.yardsale,
      loading: false,
      error: false,
    } as UseQueryResponse;
  };

  const updateYardSales = async (): Promise<UseQueryResponse> => {
    // Make query to update all yardsales for this user
    const sortBy = {
      name: filter ? filter?.sortBy?.value?.split("-")[0] : YardSaleSortByOptions[0].value.split("-")[0],
      direction: filter ? filter?.sortBy?.value?.split("-")[1] : YardSaleSortByOptions[0].value.split("-")[1]
    }
    const data = await query(GET_YARDSALES(sortBy.name, sortBy.direction));

    if (data.yardsale) {
      setYardSales(data?.yardsale);
    }
    return {
      data: data.yardsale,
      loading: false,
      error: false,
    } as UseQueryResponse;
  };

  const createNewYardsale = async (yardsale) => {
    console.log(user?.initials);
    const responseData = await query(CREATE_YARDSALE, yardsale);
    return responseData;
  };

  const updateYardsale = async (yardsale) => {
    const responseData = await query(UPDATE_YARDSALE, yardsale);
    return responseData;
  };

  const deleteYardSale = async (yardSaleId: string) => {
    const responseData = await query(DELETE_YARDSALE, {
      yardsaleUUID: yardSaleId,
    });
    console.log("\n\nResponse from delete was..");
    console.log(responseData);
    setYardSales({ ...yardSales.filter((ys) => ys.uuid !== yardSaleId) });
    return responseData;
  };

  const deleteYardSaleSellerLink = async (linkId: UUID): Promise<UseQueryResponse> => {
    //
    // Assume we've already checked for existing transactions on the particular Yard Sale
    //
    const { data } = await query(DELETE_YARDSALE_SELLER_LINK, {
      UUID: linkId,
    });
    return { data };
  };

  const getAllYardSaleSellerLinks = async (yardSaleId: UUID): Promise<any> => {
    const data = await query(GET_SELLER_LINKS_FOR_YARDSALE, {
      yardsaleUUID: yardSaleId,
    });
    setSellerLinks(data.yardsale_seller_link);
    return data.yardsale_seller_link;
  };

  const createYardSaleSellerLink = async (sellerId: UUID, yardSaleId: UUID) => {
    const { data } = await query(CREATE_YARDSALE_SELLER_LINK, {
      sellerUUID: sellerId,
      yardsaleUUID: yardSaleId,
    });
    return data;
  };

  const getSellersCanBeAdded = (
    allSellers: Array<SellersInterface>,
    existingSellerLinks: Array<YardSaleLinks>,
  ) => {
    // 
    // Todo: This needs to be re-thought. it is old
    // 
    return allSellers.filter((seller) => {
      let linkExists = false;
      existingSellerLinks?.forEach((link) => {
        if (link.seller.uuid === seller.uuid) {
          linkExists = true;
        }
      });
      return !linkExists;
    });
  };

  /**
   * Transactions
   */

  const deleteTransactionItem = async (
    transactionId: UUID,
  ): Promise<UseQueryResponse> => {
    const data = await query(DELETE_TRANSACTION_BY_UUID, {
      id: transactionId,
    });
    return { data };
  };

  const getAllTransactionsForSellerOnYardSale = async (
    yardSaleId: UUID,
    sellerId: UUID,
  ): Promise<UseQueryResponse> => {
    //
    // Returns the transactions for a particular seller on a particular yard sale
    //
    const data = await query(GET_TRANSACTION_ITEMS_FOR_SELLER_ON_YARDSALE, {
      yardsaleUUID: yardSaleId,
      sellerUUID: sellerId,
    });
    return { data };
  };

  const getAllYardSaleTransactions = async (yardSaleId: UUID): Promise<any> => {
    const data = await query(GET_TRANSACTION_ITEMS_FOR_YARDSALE, {
      yardsaleUUID: yardSaleId,
    });
    setTransactionItems(data.transaction);
    return {data: data.transaction};
  };

  const createYardSaleTransaction = async (
    yardSaleId: UUID,
    transactionItem: PendingTransactionItem,
  ): Promise<any> => {
    const { yardsale_transaction: data } = await query(
      CREATE_TRANSACTION_ITEM,
      {
        sellerUUID: transactionItem.seller.uuid,
        yardsaleUUID: yardSaleId,
        price: String(transactionItem.price),
        description: transactionItem.description,
      },
    );
    return data;
  };

  const clearSelectedYardSale = () => {
    setSelectedYardSale(null);
    setTransactionItems([]);
    setSellerLinks([]);
  };

  useEffect(() => {
    if (filter && isAuthenticated === true) {
      (async() => (
        await updateYardSales()
      ))()
    }
  }, [filter, isAuthenticated])

  return (
    <YardSalesContext.Provider
      value={{
        yardSales,
        selectedYardSale,
        sellerLinks,
        transactionItems,
        filter,
        setFilter,
        setSelectedYardSale,
        clearSelectedYardSale,
        updateYardSales,
        getYardSaleById,
        setYardSales,
        updateFilterText,
        createNewYardsale,
        updateYardsale,
        deleteYardSale,
        deleteYardSaleSellerLink,
        getAllYardSaleSellerLinks,
        createYardSaleSellerLink,
        getSellersCanBeAdded,
        getAllYardSaleTransactions,
        createYardSaleTransaction,
        getAllTransactionsForSellerOnYardSale,
        deleteTransactionItem,
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
