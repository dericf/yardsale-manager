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
  useEffect(() => {
    console.log("Getting YardSales");
    (async () => {
      await updateYardSales()
    })()
  }, []);

  return (
    <ProtectedComponent>
      <Head>
        <title>Yard Sales | Yard Sale Manager</title>
      </Head>
      <Layout activePage="yard sales">
        <Header textAlign="center" as="h2">
          Yard Sales List
        </Header>

        {/* {cashierActive && data && data.yardsale && (
          <CashierModal
              yardsale={cashierActive}
              autoOpen={true}
              setCashierActive={setCashierActive}
            />
          )} */}

        <Grid columns={2} centered className="m0 p0">
          <Grid.Row className="py0">
            {/* First Grid.Row (Filters/Buttons) */}
            <Grid.Column
              verticalAlign="middle"
              mobile={8}
              tablet={8}
              computer={10}
              className="pl0"
            >
              {/* Radio Buttons + Search Field */}
              {/* <YardsalesFilterForm
                  filter={filter}
                  setFilter={setFilter}
                  autofocus={true}
                /> */}
                <Link href='/yardsales/new' as="/yardsales/new"><Button>New</Button></Link>
            </Grid.Column>
            <Grid.Column
              mobile={8}
              tablet={8}
              computer={6}
              textAlign="right"
              className="mobile-my8 pr0"
            >
              {/* <YardsaleDetailsM`odal /> */}
            </Grid.Column>
          </Grid.Row>

          <Grid.Row className="pb0 pt0">
            {/* Second Grid.Row (Dividers with headings) */}
            <Grid.Column computer={16}>
              <Divider>{`My Yard Sales`}</Divider>
              {/* {JSON.stringify(error || "error")} */}
              {/* {JSON.stringify(loading || "loading")} */}
              {/* {JSON.stringify(data || "data")} */}
            </Grid.Column>
            {/* <Grid.Column mobile={8} tablet={7} computer={6}>
                            <Divider horizontal={true} content="Actions"></Divider>
                        </Grid.Column> */}
          </Grid.Row>

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
