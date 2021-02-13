import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button, Header, Segment } from "semantic-ui-react";
import { ConfirmResetPasswordForm } from "../components/ForgotPassword/ConfirmResetPasswordForm";
import { Layout } from "../components/layout/Layout";
import { useAuth } from "../hooks/useAuth";

export default function index({ resetCode, uuid }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <Layout activePage="confirm reset password">
      <Head>
        <title>Reset Password | Yard Sale Manager</title>
      </Head>
      {isAuthenticated === true ? (
        <Segment basic textAlign="center">
          <Header>You are already logged in</Header>{" "}
          <Button onClick={() => router.back()}>Go Back</Button>
        </Segment>
      ) : (
        <>
          {resetCode === null || uuid === null ? (
            <h1>Error with the link. Please try again</h1>
          ) : (
            <ConfirmResetPasswordForm resetCode={resetCode} uuid={uuid} />
          )}
        </>
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log("req. : ", context.query);
  let { resetCode, uuid } = context.query;
  if (typeof resetCode === "undefined") {
    resetCode = null;
  }
  if (typeof uuid === "undefined") {
    uuid = null;
  }
  return {
    props: {
      resetCode,
      uuid,
    },
  };
};
