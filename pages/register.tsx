import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Header, Segment } from "semantic-ui-react";
import { Layout } from "../components/layout/Layout";
import { LoginForm } from "../components/LoginForm/LoginForm";
import { useAuth } from "../hooks/useAuth";

export default function index() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (isAuthenticated === true) {
    return (
      <Layout>
        <Segment basic textAlign="center">
          <Header>You are already logged in</Header>{" "}
          <Button onClick={() => router.back()}>Go Back</Button>
        </Segment>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header>Register</Header>
    </Layout>
  );
}
