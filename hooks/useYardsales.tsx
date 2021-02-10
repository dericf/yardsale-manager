// https://hasura.io/learn/graphql/nextjs-fullstack-serverless/queries/2-create-query/
import { useState, useContext, useEffect, createContext } from "react";
import {
  GET_SELLER_LINKS_FOR_YARDSALE,
  GET_TRANSACTION_ITEMS_FOR_YARDSALE,
  GET_YARDSALES,
} from "../graphql/queries";
import {
  CREATE_TRANSACTION_ITEM,
  CREATE_YARDSALE,
  CREATE_YARDSALE_SELLER_LINK,
  DELETE_YARDSALE,
  DELETE_YARDSALE_SELLER_LINK,
  UPDATE_YARDSALE,
} from "../graphql/mutations";
import React from "react";
import HasuraProvider, { useHasura } from "./useHasura";
import { UseQueryResponse } from "../types/GraphQL";
import { YardSalesContextInterFace } from "../types/Context";
import { YardSalesInterface } from "../types/YardSales";
import { useAuth } from "./useAuth";
import { FormValues } from "./useForm";
import { SellersInterface } from "../types/Sellers";
import { UUID } from "../types/General";
import { YardSaleLinks } from "../types/YardSaleLinks";
import { Transaction } from "../types/Transaction";

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
  const { query, mutation } = useHasura();

  const [yardSales, setYardSales] = useState(new Array<YardSalesInterface>());
  const [selectedYardSale, setSelectedYardSale] = useState<YardSalesInterface>(
    null,
  );
  // const { client } = useHasura();
  const [sellerLinks, setSellerLinks] = useState(new Array<YardSaleLinks>());
  const [transactionItems, setTransactionItems] = useState(new Array<Transaction>());

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
    setYardSales(data.yardsale);
    console.log(data);
    return {
      data: data.yardsale,
      loading: false,
      error: false,
    } as UseQueryResponse;
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

  const deleteYardSale = async (yardSaleId: string) => {
    // post to graphql -> mutation insertYardsale
    const responseData = await query(DELETE_YARDSALE, {
      yardsaleUUID: yardSaleId,
    });
    console.log("\n\nResponse from delete was..");
    console.log(responseData);
    setYardSales({ ...yardSales.filter((ys) => ys.uuid !== yardSaleId) });
    return responseData;
  };

  const deleteYardSaleSellerLink = async (linkId: UUID): Promise<any> => {
    const { data } = await query(DELETE_YARDSALE_SELLER_LINK, {
      UUID: linkId,
    });
    
    return data;
  };

  const getAllYardSaleSellerLinks = async (yardSaleId: UUID) => {
    const {yardsale_seller_link: data} = await query(GET_SELLER_LINKS_FOR_YARDSALE, {
      yardsaleUUID: yardSaleId,
    });
    console.log("Seller Links");
    console.log(data);
    setSellerLinks(data);
    return data;
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

  const getAllYardSaleTransactions = async (yardSaleId: UUID) => {
    const {yardsale_transaction: data} = await query(GET_TRANSACTION_ITEMS_FOR_YARDSALE, {
      yardsaleUUID: yardSaleId,
    });
    console.log("\nTransactions: ");
    console.log(data);
    setTransactionItems(data);
    return data;
  };

  const createYardSaleTransaction = async (yardSaleId: UUID, transactionItem: Transaction) => {
    const {yardsale_transaction: data} = await query(CREATE_TRANSACTION_ITEM, {
      sellerUUID: transactionItem.seller.uuid,
      yardsaleUUID: yardSaleId,
      price: String(transactionItem.price),
      description: transactionItem.description,
    });
    console.log("\nTransactions: ");
    console.log(data);
    setTransactionItems(data);
    return data;
  }
  return (
    <YardSalesContext.Provider
      value={{
        yardSales,
        selectedYardSale,
        sellerLinks,
        transactionItems,
        setSelectedYardSale,
        updateYardSales,
        setYardSales,
        updateFilterText,
        filter,
        createNewYardsale,
        updateYardsale,
        deleteYardSale,
        deleteYardSaleSellerLink,
        getAllYardSaleSellerLinks,
        createYardSaleSellerLink,
        getSellersCanBeAdded,
        getAllYardSaleTransactions,   
        createYardSaleTransaction,     
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
