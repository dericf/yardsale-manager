import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, createRef, useEffect, useRef } from "react";
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
import { useAuth } from "../../hooks/useAuth";
import { useIsLoading } from "../../hooks/useIsLoading";

export const LoginForm: React.FC = (props) => {
  const router = useRouter();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await tryAuthenticateWithEmailPassword(
      loginForm.email,
      loginForm.password,
    );
    console.log("success??", success);
    if (success === true) {
      router.push('/yardsales');
    }
  };

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
        Login
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
                    fluid={true}
                    type="email"
                    name="email"
                    icon="at"
                    iconPosition="left"
                    ref={autoFocusRef}
                    value={loginForm.email}
                    onChange={handleLoginFormChange}
                  />
                </Form.Field>
              </Form.Group>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="py0">
            <Grid.Column width={16}>
              <Form.Group className="mb0">
                <Form.Field width={16}>
                  <label>Password</label>
                  <Input
                    fluid={true}
                    type="password"
                    name="password"
                    icon="key"
                    iconPosition="left"
                    value={loginForm.password}
                    onChange={handleLoginFormChange}
                  />
                </Form.Field>
              </Form.Group>
            </Grid.Column>
          </Grid.Row>
          {formErrorMessage && (
            <Grid.Row className="py0">
              <Grid.Column width={16}>
                <Message header="Error" negative>
                  <Message.Header>Error</Message.Header>
                  <Message.Content>{formErrorMessage}</Message.Content>
                </Message>
              </Grid.Column>
            </Grid.Row>
          )}
          <Grid.Row className="pb8 pt16" divided centered>
            <Grid.Column width={8} textAlign="left">
              <Link href="/register" as="/register">
                Create a New Account
              </Link>
            </Grid.Column>

            <Grid.Column width={8} textAlign="right">
              <Link href="/password-reset" as="/password-reset">
                Forgot your password?
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
              content="Log In"
              fluid={true}
              primary
              loading={loadingState.isLoading}
              disabled={
                loginForm.email == "" ||
                loginForm.password == "" ||
                loginForm.password.length < 6
              }
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};
