import Head from "next/head";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Header,
  Input,
  Message,
  Popup,
  Segment,
} from "semantic-ui-react";
import { Layout } from "../../components/layout/Layout";
import { ProtectedComponent } from "../../components/ProtectedComponent";
import { useAlert } from "../../hooks/useAlert";
import { useAuth } from "../../hooks/useAuth";
import useForm from "../../hooks/useForm";
import { FormErrorObject } from "../../types/Errors";
import { GenericResponse } from "../../types/RequestResponse";

export default function index() {
  const {
    user,
    refreshToken,
    refreshNewAccessToken,
    sessionExpiresAt,
  } = useAuth();
  const { sendAlert, sendError } = useAlert();
  const [sessionLastUpdatedAt, setSessionLastUpdatedAt] = useState<string>();
  const refreshSession = async (e) => {
    refreshNewAccessToken(refreshToken);
    setTimeout(() => {
      setSessionLastUpdatedAt(localStorage?.getItem("sessionLastUpdatedAt"));
      sendAlert("Your session has been renewed.");
    }, 1000);
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localStorage) {
        setSessionLastUpdatedAt(localStorage?.getItem("sessionLastUpdatedAt"));
      }
    }, 2 * 1000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const tryResetPassword = async () => {
    const body = {
      ...values,
      userUUID: user.uuid,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/authenticated-change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );
      const json: GenericResponse = await response.json();
      if (json.STATUS === "ERROR") {
        sendError(json.MESSAGE);
      } else if (json.STATUS === "OK") {
        sendAlert("Success! Your password has been changed");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const validate = () => {
    let errors = {} as FormErrorObject;
    if (values.currentPassword.length === 0) {
      errors.currentPassword =
        "Please check that you've entered your current password.";
    }
    if (
      values.newPassword.length === 0 ||
      values.confirmNewPassword.length === 0
    ) {
      errors.newPassword = "Please check that you've entered your new password";
    }
    if (values.newPassword !== values.confirmNewPassword) {
      errors.confirmNewPassword = "Your new passwords do not match.";
    }
    return errors;
  };

  const { values, setValues, handleChange, handleSubmit } = useForm({
    initialValues,
    onSubmit: tryResetPassword,
    validate,
  });

  return (
    <ProtectedComponent>
      <Head>
        <title>Account | Yard Sale Manager</title>
      </Head>
      <Layout activePage="account">
        <Header textAlign="center" as="h2">
          User Account
        </Header>
        <Divider></Divider>
        {user && (
          <div className="flex row justify-around align-center wrap" >
            <div className="flex col align-stretch" style={{margin: "0.75rem"}}>
              <Segment padded basic>
                <Card centered raised>
                  <Card.Header
                    textAlign="center"
                    as="h3"
                    style={{ paddingTop: "0.75rem", paddingBottom: "0.75rem" }}
                  >
                    {user.name}
                  </Card.Header>
                  <Card.Content>
                    <div className="flex row justify-between align-center">
                      <Segment compact inverted circular>
                        <span style={{ fontSize: "2rem" }}>
                          {user.initials}
                        </span>
                      </Segment>

                      <div className="flex col">
                        <Popup
                          content="Your email address is linked to your user account, and cannot be changed."
                          inverted
                          trigger={<strong>{user.email}</strong>}
                        ></Popup>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              </Segment>
            </div>
            <div className="flex col align-center" style={{margin: "0.75rem"}}>
              <Message size="large">
                <Message.Header>Session Last Updated</Message.Header>
                <Message.Content>{sessionLastUpdatedAt}</Message.Content>
                <Divider></Divider>
                <Message.Header>Session Expires</Message.Header>
                <Message.Content>{sessionExpiresAt()}</Message.Content>
              </Message>
              <Button onClick={refreshSession} positive>
                Refresh Session
              </Button>
            </div>
            <div className="flex col align-stretch" style={{margin: "0.75rem"}}>
              <form action="/" method="post" onSubmit={handleSubmit}>
                <Segment className="flex col" padded raised>
                  <Header>Change Your Password</Header>
                  <Input
                    placeholder="current password"
                    type="password"
                    name="currentPassword"
                    value={values.currentPassword}
                    onChange={handleChange}
                    style={{ marginBottom: "0.75rem" }}
                  />
                  <Input
                    placeholder="new password"
                    type="password"
                    name="newPassword"
                    value={values.newPassword}
                    onChange={handleChange}
                    style={{ marginBottom: "0.75rem" }}
                  />
                  <Input
                    placeholder="confirm new password"
                    type="password"
                    value={values.confirmNewPassword}
                    onChange={handleChange}
                    name="confirmNewPassword"
                    style={{ marginBottom: "0.75rem" }}
                  />
                  <Button type="submit" fluid basic negative>
                    Confirm
                  </Button>
                </Segment>
              </form>
            </div>
          </div>
        )}
      </Layout>
    </ProtectedComponent>
  );
}
