import Head from "next/head";
import { useRouter } from "next/router";
import { Button, Header, Segment } from "semantic-ui-react";
import { Layout } from "../components/Layout/Layout";
import { LoginForm } from "../components/LoginForm/LoginForm";
import { useAuth } from "../hooks/useAuth";

export default function index() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <Layout activePage="login">
      <Head>
        <title>Log In | Yard Sale Manager</title>
      </Head>
      {isAuthenticated === true ? (
        <Segment basic textAlign="center">
          <Header>You are already logged in</Header>{" "}
          <Button onClick={() => router.back()}>Go Back</Button>
        </Segment>
      ) : (
        <LoginForm />
      )}
    </Layout>
  );
}
