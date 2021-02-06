import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  Button,
  Divider,
  Grid,
  Header,
  Item,
  ItemGroup,
  Menu,
  Segment,
} from "semantic-ui-react";
import { Home } from "../components/Home/Home";
import { Layout } from "../components/Layout/Layout";
import { useAuth } from "../hooks/useAuth";
interface Props {}

const index: NextPage<Props> = (props) => {
  const {isAuthenticated, logout} = useAuth()

  return (
    <Layout activePage="home">
      <Head>
        <title>Home | Yard Sale Manager</title>
      </Head>
      <Home />      
    </Layout>
  );
};

export default index;
