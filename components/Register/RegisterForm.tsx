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
import { InitialsInfoPopup } from "./InitialsInfoPopup";

export const RegisterForm: React.FC = (props) => {
  const router = useRouter();
  const autoFocusRef = useRef();
  const { loadingState } = useIsLoading();
  const [accountCreated, setAccountCreated] = useState(false);

  const {
    registerForm,
    handleRegisterFormChange,
    formErrorMessage,
    tryRegisterUser,
  } = useAuth();

  useEffect(() => {
    if (autoFocusRef && autoFocusRef.current) {
      autoFocusRef?.current?.focus();
    }
  }, [autoFocusRef]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await tryRegisterUser();
    console.log("success??", success);
    if (success === true) {
      setAccountCreated(true);
    } else {
      setAccountCreated(false);
    }
  };

  return (
    <Segment
      padded
      size="huge"
      style={{
        marginTop: 32,
        maxWidth: 500,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <Header textAlign="center" as="h2">
        Register New Account
      </Header>

      {!accountCreated && (
        <Form
          name="register-form"
          id="RegisterForm"
          onSubmit={handleSubmit}
          as={Form}
          className="m0"
        >
          <Grid>
            <Grid.Row className="py0">
              <Grid.Column width={10}>
                <Form.Group>
                  <Form.Field width={16}>
                    <label>Name</label>
                    <Input
                      fluid
                      type="text"
                      name="name"
                      icon="user"
                      iconPosition="left"
                      ref={autoFocusRef}
                      value={registerForm.name}
                      onChange={handleRegisterFormChange}
                    />
                  </Form.Field>
                </Form.Group>
              </Grid.Column>
              <Grid.Column width={6}>
                <Form.Group>
                  <Form.Field width={16}>
                    {/* TODO: Turn this Help Popup into its own component: Start the standard for the help popup for consistency */}
                    <Popup
                      hoverable
                      inverted
                      position="bottom right"
                      content={<InitialsInfoPopup />}
                      trigger={
                        <label>
                          Initials or I.D.
                          <Icon
                            className="info-popup-icon"
                            fitted
                            name="help circle"
                            style={{ float: "right" }}
                          />
                        </label>
                      }
                    />
                    <Input
                      fluid
                      type="text"
                      name="initials"
                      icon="id badge"
                      iconPosition="left"
                      value={registerForm.initials}
                      onChange={handleRegisterFormChange}
                    />
                  </Form.Field>
                </Form.Group>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row className="">
              <Grid.Column width={16}>
                <Form.Group>
                  <Form.Field width={16}>
                    <label>Email</label>
                    <Input
                      fluid
                      type="email"
                      name="email"
                      icon="at"
                      iconPosition="left"
                      value={registerForm.email}
                      onChange={handleRegisterFormChange}
                    />
                  </Form.Field>
                </Form.Group>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row className="pb0">
              <Grid.Column width={16}>
                <Form.Group>
                  <Form.Field width={16}>
                    <label>
                      Password{" "}
                      <Popup
                        inverted
                        trigger={
                          <Icon
                            className="info-popup-icon"
                            name="help circle"
                          ></Icon>
                        }
                      >
                        <Popup.Content>
                          Password must be at least 6 characters long.
                        </Popup.Content>
                      </Popup>
                    </label>
                    <Input
                      fluid
                      type="password"
                      name="password"
                      icon="key"
                      iconPosition="left"
                      value={registerForm.password}
                      onChange={handleRegisterFormChange}
                    />
                  </Form.Field>
                </Form.Group>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row className="pt0">
              <Grid.Column width={16}>
                <Form.Group>
                  <Form.Field width={16}>
                    <label>Confirm Password</label>
                    <Input
                      fluid
                      type="password"
                      name="confirmPassword"
                      icon="key"
                      iconPosition="left"
                      value={registerForm.confirmPassword}
                      onChange={handleRegisterFormChange}
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
            <Grid.Row className="pt0" columns={16}>
              <Grid.Column width={16} textAlign="center">
                <Link href="/login" as="/login">
                  Already have an account? Log in
                </Link>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16} textAlign="center">
                <Link href="/password-reset" as="/password-reset">
                  Forgot your password? Change it here
                </Link>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row className="pb0">
              <Grid.Column textAlign="center"></Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      )}

      {accountCreated && (
        <Message success>
          <Message.Content>
            Your account was created. Please check your email for confirmation.
          </Message.Content>
        </Message>
      )}
      <Grid>
        <Grid.Row columns={1}>
          {/* <Grid.Column width={8}>
                <Button
                  onClick={closeModal}
                  negative
                  fluid
                  disabled={forcedOpen}
                >
                  Cancel
                </Button>
              </Grid.Column> */}

          <Grid.Column width={16}>
            {!accountCreated && (
              <Button
                primary
                form="RegisterForm"
                type="submit"
                className="save"
                content="Create Account"
                fluid
                disabled={
                  registerForm.email == "" ||
                  registerForm.password == "" ||
                  registerForm.password.length < 6 ||
                  registerForm.password !== registerForm.confirmPassword
                }
              />
            )}

            {accountCreated && (
              <Link href="/login" as="/login">
                <Button positive content="Go to Log in" fluid />
              </Link>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};
