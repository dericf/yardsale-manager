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

export const ConfirmResetPasswordForm = ({ resetCode, uuid }: Props) => {
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
    password: "",
    confirmPassword: "",
  };
  const onSubmit = async () => {
    const uri = `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/complete-change-password`;
    const data = {
      new_password: values.password,
      confirm_new_password: values.confirmPassword,
      reset_code: resetCode,
      uuid: uuid,
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
        router
          .push("/login")
          .then((_) =>
            sendAlert("Success! Your new password has been updated."),
          );
      } else if (json.STATUS === "ERROR") {
        if (json.MESSAGE === "User not found") {
          autoFocusRef.current.focus();
          sendError("No user was found matching that email. Please try again.");
        } else if (json.MESSAGE === "Reset code does not match") {
          sendError("Password does not match. Please try again.");
        } else if (json.MESSAGE === "Passwords do not match") {
          sendError("Passwords do not match. Please try again.");
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
                  <label className="info-popup-icon">
                    Password <Icon name="help circle" />
                  </label>
                  <Input
                    fluid
                    type="password"
                    name="password"
                    icon="key"
                    iconPosition="left"
                    ref={autoFocusRef}
                    value={values.password}
                    onChange={handleChange}
                  />
                </Form.Field>

                <Form.Field width={16}>
                  <label>ConfirmPassword</label>
                  <Input
                    fluid
                    type="password"
                    name="confirmPassword"
                    icon="key"
                    iconPosition="left"
                    value={values.confirmPassword}
                    onChange={handleChange}
                  />
                </Form.Field>
              </Form.Group>
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
              content="Confirm Password Reset"
              fluid
              primary
              loading={loadingState.isLoading}
              disabled={values.password === "" || values.confirmPassword === ""}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};
