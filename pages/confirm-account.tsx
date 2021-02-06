import { GetServerSideProps } from "next";
import { setLazyProp } from "next/dist/next-server/server/api-utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Button, Grid, Header, Message, Segment } from "semantic-ui-react";
import { Layout } from "../components/Layout/Layout";
import { LoginForm } from "../components/LoginForm/LoginForm";
import { useAlert } from "../hooks/useAlert";
import { useAuth } from "../hooks/useAuth";
import { useIsLoading } from "../hooks/useIsLoading";
import { GenericResponse } from "../types/RequestResponse";

export default function index({ hasBeenConfirmed }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { sendAlert, sendError } = useAlert();
  const { loadingState, setLoadingState } = useIsLoading();

  useEffect(() => {
    if (hasBeenConfirmed === true) {
      sendAlert("Account Confirmed!");
    } else {
      sendError("Something went wrong");
    }
  }, []);

  if (isAuthenticated === true) {
    return (
      <Layout activePage="confirm account">
        <Segment basic textAlign="center">
          <Header>You are already logged in</Header>{" "}
          <Button onClick={() => router.back()}>Go Back</Button>
        </Segment>
      </Layout>
    );
  }

  return (
    <Layout activePage="confirm account">
      <Segment basic textAlign="center" style={{ marginTop: "25%" }}>
        {hasBeenConfirmed === true ? (
          <>
            <Message
              content="Success! Your email has been confirmed and your account is now active. You may now proceed to log in."
              success
            ></Message>

            <Link href="/login" as="/login">
              <Button
                style={{
                  maxWidth: 200,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                fluid
                primary
              >
                Log In
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Message
              content="Something went wrong. Please try again"
              error
            ></Message>
            <Button
              onClick={() => router.back()}
              style={{
                maxWidth: 200,
                marginLeft: "auto",
                marginRight: "auto",
              }}
              fluid
              primary
            >
              Go Back
            </Button>
          </>
        )}
      </Segment>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log("req. :>> ", context.query);
  const { key, uid } = context.query;
  let hasBeenConfirmed = false;
  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/register/confirm?key=${key}&uid=${uid}`,
  );
  if (resp.status >= 200 && resp.status < 300) {
    const data: GenericResponse = await resp.json();
    console.log("data :>> ", data);
    if (data.STATUS === "OK") {
      hasBeenConfirmed = true;
    }
  }

  return {
    props: {
      hasBeenConfirmed,
    },
  };
};
