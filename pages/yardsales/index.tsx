import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  split,
  useQuery,
  useApolloClient,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "apollo-link-context";
import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { Fragment, useEffect } from "react";
import { Button, Divider, Grid, Header, Segment } from "semantic-ui-react";
import { Layout } from "../../components/Layout/Layout";
// import useSWR from "swr";
import { ProtectedComponent } from "../../components/ProtectedComponent";
import { GET_YARDSALES } from "../../graphql/queries";
import { useAuth } from "../../hooks/useAuth";
import { useHasura } from "../../hooks/useHasura";
import { useYardsales } from "../../hooks/useYardsales";
import { YardSalesContextInterFace } from "../../types/Context";
import {YardSaleList} from '../../components/YardSales/YardsaleList'
import { YardSalesInterface } from "../../types/YardSales";

export default function index() {
  const { user, token } = useAuth();
  // const { data } = useSWR(["/api/posts", user]);
  const {
    yardSales,
    updateYardSales,
    selectedYardSale,
    filter,
    updateFilterText,
    setYardSales,
  } = useYardsales();
  // const {client} = useHasura()
  // const { loading, error, data } = useQuery({query: GET_YARDSALES});

  const {mutation, query} = useHasura()
  // const { query } = useApolloClient();
  return (
    <ProtectedComponent>
      <Head>
        <title>Yard Sales | Yard Sale Manager</title>
      </Head>
      <Layout activePage="yard sales">
        <Header textAlign="center" as="h2">
          Yard Sales List
        </Header>
        {/* <div>
          <pre>{JSON.stringify(yardSales, null, 2)}</pre>
        </div> */}
        <Grid columns={2} centered className="m0 p0">

          {/* Yardsales List */}
          {/* {loading && <Loading />} */}
          {/* <pre>{JSON.stringify(yardSales, null, 4)}</pre> */}
          <YardSaleList></YardSaleList>
        </Grid>
      </Layout>
    </ProtectedComponent>
  );
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   console.log("req. :>> ", context.query);
//   // const {token} = useAuth()

//   return {
//     props: {
//     },
//   };
// };

/**
 * 
 * {!loading &&
            data &&
            data.yardsale &&
            data.yardsale
              .filter((yardsale) => {
                return (
                  filter.searchText === "" // ||
                  // (filter.searchText !== "" &&
                  //   (String(yardsale.name)
                  //     .toLowerCase()
                  //     .includes(filter.searchText.toLowerCase()) ||
                  //     String(yardsale.company)
                  //       .toLowerCase()
                  //       .includes(filter.searchText.toLowerCase()) ||
                  //     String(yardsale.address_text)
                  //       .toLowerCase()
                  //       .includes(filter.searchText.toLowerCase())) &&
                  //   (filter.status === "all" ||
                  //     (filter.status === "active" &&
                  //       yardsale.is_active === true) ||
                  //     (filter.status === "inactive" &&
                  //       yardsale.is_active === false)))
                );
              })
              .map((yardsale) => {
                return (
                  <Grid.Row key={yardsale.uuid}>
                    <Grid.Column width={12} textAlign="center">
                      <Fragment>
                          <p
                          style={{
                            width: "100px",
                            height: "70px",
                            border: "solid 1px #000",
                          }}
                        >
                          Yardsale Card
                        </p>
                      </Fragment>
                    </Grid.Column>

                    
                  </Grid.Row>
                );
              })}
 */
