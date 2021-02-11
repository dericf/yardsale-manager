import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  split,
  useQuery,
  useApolloClient,
  fromError,
} from "@apollo/client";
import { GetServerSideProps, NextPageContext } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Button, Header, Item, Menu, Segment, Table } from "semantic-ui-react";
import { CashierForm } from "../components/Cashier/CashierForm";
import { Layout } from "../components/Layout/Layout";
// import useSWR from "swr";
import { ProtectedComponent } from "../components/ProtectedComponent";
import { TransactionTable } from "../components/Tables/TransactionTable";
import YardsaleForm from "../components/YardSales/YardSaleForm";
import { useAuth } from "../hooks/useAuth";
import YardSalesProvider, { useYardsales } from "../hooks/useYardsales";
import { UUID } from "../types/General";
import { toMoney } from "../utilities/money_helpers";

const index = () => {
  const { user, token } = useAuth();
  const {
    selectedYardSale,
    yardSales,
    updateYardSales,
    setSelectedYardSale,
    getYardSaleById,
    transactionItems,
    getAllYardSaleTransactions,
    getAllYardSaleSellerLinks,
  } = useYardsales();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (selectedYardSale !== null) {
        await getAllYardSaleTransactions(selectedYardSale.uuid);
        await getAllYardSaleSellerLinks(selectedYardSale.uuid);
      } else {
        await updateYardSales();
      }
    })();
  }, [selectedYardSale]);

  return (
    <ProtectedComponent>
      <Head>
        <title>Cashier | Yard Sale Manager</title>
      </Head>
      <Layout activePage="yard sales">
        <Header textAlign="center" as="h2">
          {selectedYardSale !== null
            ? `New Transaction for ${selectedYardSale.name}`
            : "Please Select a Yard Sale"}
        </Header>
        {selectedYardSale ? (
          <>
            <CashierForm yardSale={selectedYardSale} />
            {transactionItems && (
              <TransactionTable yardSale={selectedYardSale}></TransactionTable>
            )}
          </>
        ) : (
          <Segment basic textAlign="center">
            <Menu vertical fluid borderless>
              {yardSales.map((ys, index) => (
                <Menu.Item key={ys.uuid}>
                  <Button basic onClick={async (e) => setSelectedYardSale(ys)}>
                    {index} - {ys.name}
                  </Button>
                </Menu.Item>
              ))}
            </Menu>
          </Segment>
        )}
      </Layout>
    </ProtectedComponent>
  );
};

export default index;
