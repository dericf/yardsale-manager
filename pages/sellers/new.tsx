import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  split,
  useQuery,
  useApolloClient,
  fromError,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "apollo-link-context";
import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect } from "react";
import {
  Button,
  Divider,
  Form,
  Grid,
  Header,
  Input,
  Label,
  Message,
  Segment,
} from "semantic-ui-react";
import { Layout } from "../../components/Layout/Layout";
// import useSWR from "swr";
import { ProtectedComponent } from "../../components/ProtectedComponent";
import { SellersForm } from "../../components/Sellers/SellersForm";
import YardsaleForm from "../../components/YardSales/YardSaleForm";
import { GET_YARDSALES } from "../../graphql/queries";
import { useAlert } from "../../hooks/useAlert";
import { useAuth } from "../../hooks/useAuth";
import useForm, { FormErrors, FormValues } from "../../hooks/useForm";
import { useHasura } from "../../hooks/useHasura";
import { useSellers } from "../../hooks/useSeller";
import { useYardsales } from "../../hooks/useYardsales";
import { YardSalesContextInterFace } from "../../types/Context";
import { SellersInterface } from "../../types/Sellers";
import { YardSalesInterface } from "../../types/YardSales";

interface Props {
  seller?: SellersInterface;
}

const newSeller = ({ seller }: Props) => {
  const { user, token } = useAuth();
  const { selectedSeller } = useSellers();
  return (
    <ProtectedComponent>
      <Head>
        <title>New Seller | Yard Sale Manager</title>
      </Head>
      <Layout activePage="yard sales">
        <Header textAlign="center" as="h2">
          New Seller
        </Header>
        <SellersForm seller={selectedSeller} />
      </Layout>
    </ProtectedComponent>
  );
};
export default newSeller;
