import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Header, Segment } from "semantic-ui-react";
import { Layout } from "../components/layout/Layout";
import { LoginForm } from "../components/LoginForm/LoginForm";
import { RegisterForm } from "../components/Register/RegisterForm";
import { useAuth } from "../hooks/useAuth";

export default function index() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <Layout activePage="register">
      <Head>
        <title>Register | Yard Sale Manager</title>
      </Head>
      {isAuthenticated === true ? (
        <Segment basic textAlign="center">
          <Header>You are already logged in</Header>{" "}
          <Button onClick={() => router.back()}>Go Back</Button>
        </Segment>
      ) : (
        <RegisterForm />
      )}
    </Layout>
  );
}
