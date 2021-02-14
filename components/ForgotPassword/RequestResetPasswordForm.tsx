import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, {
  useState,
  createRef,
  useEffect,
  useRef,
  PropsWithChildren,
} from "react";
import {
  Card,
  Icon,
  Divider,
  Grid,
  Modal,
  Button,
  Form,
  Input,
  TextArea,
  Menu,
  Header,
  Tab,
  Message,
  Item,
  Popup,
  Segment,
} from "semantic-ui-react";
import { useAlert } from "../../hooks/useAlert";
import { useAuth } from "../../hooks/useAuth";
import useForm from "../../hooks/useForm";
import { useIsLoading } from "../../hooks/useIsLoading";
import { GenericResponse } from "../../types/RequestResponse";

interface Props {
  resetCode: string;
  uuid: string;
}

export const RequestResetPasswordForm = () => {
  const router = useRouter();
  const { sendAlert, sendError } = useAlert();
  const autoFocusRef = useRef<Input>();
  const { loadingState } = useIsLoading();
  const {
    loginForm,
    formErrorMessage,
    handleLoginFormChange,
    tryAuthenticateWithEmailPassword,
  } = useAuth();

  useEffect(() => {
    if (autoFocusRef && autoFocusRef.current) {
      autoFocusRef?.current?.focus();
    }
  }, [autoFocusRef]);
  const initialValues = {
    email: "",
  };
  const onSubmit = async () => {
    const uri = `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/request-change-password`;
    const data = {
      email: values.email,
    };
    // let options =
    try {
      const resp = await fetch(uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": "true",
        },
        body: JSON.stringify(data),
      });

      const json: GenericResponse = await resp.json();
      // console.log('JSON: ', json)
      if (json.STATUS === "OK") {
        sendAlert("Success! Check your email inbox for the link.");
      } else if (json.STATUS === "ERROR") {
        // console.log('Bad Login Credentials', json)

        if (json.MESSAGE === "User not found") {
          // console.log('User not found', json)

          // setValues(prev => ({ ...prev, email: "" }))
          autoFocusRef.current.focus();
          sendError("No user was found matching that email. Please try again.");
        } else if (json.MESSAGE === "Wrong password") {
          sendError("Password does not match. Please try again.");

          // console.log('Bad password', json)
        } else if (json.MESSAGE === "Email not confirmed") {
          sendError(
            "The email associated with this account has not been confirmed yet. Please check your email and follow the link provided and then log in again.",
          );

          // console.log('Email not confirmed', json)
        }
      }
    } catch (err) {
      // console.log('ERROR', err)
      sendError("There was a problem on our end. Please try again later.");
    }
  };

  const { handleChange, handleSubmit, values } = useForm({
    onSubmit,
    initialValues,
  });

  return (
    <Segment
      padded
      size="huge"
      style={{
        marginTop: "15%",
        maxWidth: 500,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <Header textAlign="center" as="h2">
        Reset your Password
      </Header>

      <Form
        widths="equal"
        name="login-form"
        id="LoginForm"
        as={Form}
        className="m0"
        onSubmit={handleSubmit}
      >
        <Grid verticalAlign="middle">
          <Grid.Row className="py0">
            <Grid.Column width={16}>
              <Form.Group className="mb0">
                <Form.Field width={16}>
                  <label>Email</label>
                  <Input
                    fluid
                    type="email"
                    name="email"
                    icon="at"
                    iconPosition="left"
                    ref={autoFocusRef}
                    value={values.email}
                    onChange={handleChange}
                  />
                </Form.Field>
              </Form.Group>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row className="pb8 pt16" divided centered>
            <Grid.Column width={8} textAlign="left">
              <Link href="/register" as="/register">
                Create a New Account
              </Link>
            </Grid.Column>

            <Grid.Column width={8} textAlign="right">
              <Link href="/login" as="/login">
                Log In Instead
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>

      <Grid>
        <Grid.Row columns={1}>
          <Grid.Column width={16}>
            <Button
              form="LoginForm"
              type="submit"
              className="save"
              content="Request Password Reset"
              fluid
              primary
              loading={loadingState.isLoading}
              disabled={values.email === ""}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};
