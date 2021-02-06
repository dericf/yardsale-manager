import Head from "next/head";
import { Header } from "semantic-ui-react";
import { Layout } from "../../components/Layout/Layout";
import { ProtectedComponent } from "../../components/ProtectedComponent";
import { useAuth } from "../../hooks/useAuth";

export default function index() {
  const {user} = useAuth()
  return (
    <ProtectedComponent>
      <Head>
        <title>Account | Yard Sale Manager</title>
      </Head>
      <Layout activePage="account">
        <Header textAlign="center" as="h2">
          Account Settings
        </Header>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </Layout>
    </ProtectedComponent>
  );
}
