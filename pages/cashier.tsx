import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  split,
  useQuery,
  useApolloClient,
  fromError,
} from "@apollo/client";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Header,
} from "semantic-ui-react";
import { CashierForm } from "../components/Cashier/CashierForm";
import { Layout } from "../components/Layout/Layout";
// import useSWR from "swr";
import { ProtectedComponent } from "../components/ProtectedComponent";
import YardsaleForm from "../components/YardSales/YardSaleForm";
import { useAuth } from "../hooks/useAuth";


const index = () => {
  const { user, token } = useAuth();
  const router = useRouter()
  
  return (
    <ProtectedComponent>
      <Head>
        <title>Cashier | Yard Sale Manager</title>
      </Head>
      <Layout activePage="yard sales">
        <Header textAlign="center" as="h2">
          New Transaction
        </Header>
        <CashierForm />
      </Layout>
    </ProtectedComponent>
  );
}
export default index;