import Head from 'next/head'
import { Header, Segment } from "semantic-ui-react";
import { Layout } from "../../components/Layout/Layout";
// import useSWR from "swr";
import { ProtectedComponent } from "../../components/ProtectedComponent";
import { useAuth } from "../../hooks/useAuth";

export default function index() {
  const { user } = useAuth();
  // const { data } = useSWR(["/api/posts", user]);
  return (
    <ProtectedComponent>
      <Head>
        <title>Sellers | Yard Sale Manager</title>
      </Head>
      <Layout activePage="sellers">
        <Header textAlign="center" as="h2">Sellers List</Header>
      </Layout>
    </ProtectedComponent>
  );
}
