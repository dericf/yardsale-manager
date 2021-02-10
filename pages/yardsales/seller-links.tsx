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
import { YardSaleList } from "../../components/YardSales/YardsaleList";
import { YardSalesInterface } from "../../types/YardSales";
import { YardSaleSellerLinks } from "../../components/YardSales/YardsaleSellerLinks";
import { useRouter } from "next/router";

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

  const { mutation, query } = useHasura();
  const router = useRouter();

  // const { query } = useApolloClient();
  return (
    <ProtectedComponent>
      <Head>
        <title>Yard Sales | Yard Sale Manager</title>
      </Head>
      <Layout activePage="yard sales">
        <Header textAlign="center" as="h2">
          Seller Links For Yardsale {selectedYardSale?.name}
        </Header>
        <Grid columns={2} centered className="m0 p0">
          <YardSaleSellerLinks />
        </Grid>
      </Layout>
    </ProtectedComponent>
  );
}
