import Head from "next/head";
import { useRouter } from "next/router";
import { Button, Header, Segment } from "semantic-ui-react";
import { RequestResetPasswordForm } from "../components/ForgotPassword/RequestResetPasswordForm";
import { Layout } from "../components/layout/Layout";
import { useAuth } from "../hooks/useAuth";

export default function index({}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  return (
    <Layout activePage="request reset password">
      <Head>
        <title>Reset Password | Yard Sale Manager</title>
      </Head>
      {isAuthenticated === true ? (
        <Segment basic textAlign="center">
          <Header>You are already logged in</Header>{" "}
          <Button onClick={() => router.back()}>Go Back</Button>
        </Segment>
      ) : (
        <RequestResetPasswordForm />
      )}
    </Layout>
  );
}