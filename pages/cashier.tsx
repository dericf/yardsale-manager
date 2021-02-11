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
              <Segment>
                <Header as="h2">Transaction History</Header>

                <Table
                  className="mt0"
                  striped
                  compact
                  basic="very"
                  unstackable
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    maxWidth: "600px   ",
                  }}
                >
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell textAlign="left" style={{ width: 200 }}>
                        Seller
                      </Table.HeaderCell>
                      <Table.HeaderCell textAlign="left">
                        Description
                      </Table.HeaderCell>
                      <Table.HeaderCell
                        textAlign="center"
                        style={{ width: 140 }}
                      >
                        Price
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    <>
                      {/* <Highlight >
                                                {JSON.stringify(invoice, null, 2)}
                                            </Highlight> */}

                      {transactionItems?.length === 0 && (
                        <Table.Row textAlign="center">
                          <Table.Cell textAlign="center" colSpan="5">
                            No Transactions for this Yardsale
                          </Table.Cell>
                        </Table.Row>
                      )}

                      {transactionItems?.map((item) => {
                        return (
                          <Table.Row key={item.uuid}>
                            <Table.Cell textAlign="left">
                              {item.seller.name} ({item.seller.initials}){" "}
                              {item.seller.is_deleted === true && (
                                <strong> - *Seller Removed*</strong>
                              )}
                            </Table.Cell>
                            <Table.Cell textAlign="left">
                              {item.description}
                            </Table.Cell>
                            <Table.Cell textAlign="right">
                              $ {toMoney(item.price)}
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </>
                  </Table.Body>
                </Table>
              </Segment>
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
