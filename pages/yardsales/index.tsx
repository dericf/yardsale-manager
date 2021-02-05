import { Segment } from "semantic-ui-react";
import { Layout } from "../../components/layout/Layout";
// import useSWR from "swr";
import { ProtectedComponent } from "../../components/ProtectedComponent";
import { useAuth } from "../../hooks/useAuth";

export default function index() {
  const { user } = useAuth();
  // const { data } = useSWR(["/api/posts", user]);
  return (
    <ProtectedComponent>
      <Layout>
        <Segment raised>Yardsales List</Segment>
      </Layout>
    </ProtectedComponent>
  );
}
