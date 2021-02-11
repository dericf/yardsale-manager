import Head from "next/head";
import { useEffect } from "react";
import { Header, Segment } from "semantic-ui-react";
import { Layout } from "../../components/Layout/Layout";
// import useSWR from "swr";
import { ProtectedComponent } from "../../components/ProtectedComponent";
import { SellersList } from "../../components/Sellers/SellersList";
import { useAuth } from "../../hooks/useAuth";
import { useSellers } from "../../hooks/useSeller";

export default function index() {
  const { user } = useAuth();
  const { sellers, updateSellers } = useSellers();
  // const { data } = useSWR(["/api/posts", user]);
  useEffect(() => {
    (async () => {
      await updateSellers();
    })();
  }, []);

  return (
    <ProtectedComponent>
      <Head>
        <title>Sellers | Yard Sale Manager</title>
      </Head>
      <Layout activePage="sellers">
        <Header textAlign="center" as="h2">
          Sellers List
        </Header>
        <SellersList />
      </Layout>
    </ProtectedComponent>
  );
}
