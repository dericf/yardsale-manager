import React, {
  Component,
  Fragment,
  useState,
  createRef,
  useEffect,
  useRef,
} from "react";
import { Link, withRouter } from "react-router-dom";
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
} from "semantic-ui-react";

// Apollo/GQL

// Toast Notification
import { notify } from "react-notify-toast";

import { BASE_URL } from "../../../constants";

import { AuthContext } from "../../../AuthContext";

const ForgotPasswordModal = ({
  defaultOpen = true,
  forcedOpen = true,
  step = "request",
  ...props
}) => {
  const { auth, setAuth } = React.useContext(AuthContext);
  const client = props.client;
  const autoFocusRef = useRef();
  const initialValues = {
    email: "",
    password: "",
  };

  const [open, setOpen] = useState(defaultOpen);
  const [values, setValues] = useState(initialValues);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(null);

  const closeModal = () => {
    setOpen(false);
    props.history.replace("/");
  };
  const openModal = () => {
    setOpen(true);
    // console.log('Ref: ', nameRef)
    // nameRef.current.focus()
  };

  useEffect(() => {
    if (open === true) {
      autoFocusRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    // If the user has been sent here in order to re-authenticate the "session". display a message
    if (auth.reAuthenticateRequired === true) {
      setErrorMessage(
        (errorMessage) => "Your session has timed out. Please log in again.",
      );
    }
  }, [open, auth, errorMessage]);

  const handleInputChange = (event) => {
    // TODO: Move this to a hook
    const target = event.target;
    const val = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setValues({
      ...values,
      [name]: val,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAuth({ ...auth, loading: true });
    let uri = `${BASE_URL}/auth/request-change-password`;
    let data = {
      email: values.email,
    };
    // let options =

    fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        // console.log("Login Response is: ", res)
        return res.json();
      })
      .then((json) => {
        // console.log('JSON: ', json)
        if (json.STATUS === "OK") {
          setShowSuccessMessage(true);
          setAuth({
            ...auth,
            loading: false,
          });
        } else if (json.STATUS === "ERROR") {
          // console.log('Bad Login Credentials', json)
          setShowSuccessMessage(false);
          if (json.MESSAGE === "User not found") {
            // console.log('User not found', json)
            setAuth((auth) => ({
              ...auth,
              loading: false,
              reAuthenticateRequired: false,
            }));
            // setValues(prev => ({ ...prev, email: "" }))
            autoFocusRef.current.focus();
            setErrorMessage(
              "No user was found matching that email. Please try again.",
            );
          } else if (json.MESSAGE === "Wrong password") {
            setErrorMessage("Password does not match. Please try again.");
            setAuth((auth) => ({
              ...auth,
              loading: false,
              reAuthenticateRequired: false,
            }));
            // console.log('Bad password', json)
          } else if (json.MESSAGE === "Email not confirmed") {
            setErrorMessage(
              "The email associated with this account has not been confirmed yet. Please check your email and follow the link provided and then log in again.",
            );
            setAuth((auth) => ({
              ...auth,
              loading: false,
              reAuthenticateRequired: false,
            }));
            // console.log('Email not confirmed', json)
          }
        }
      })
      .catch((err) => {
        // console.log('ERROR', err)
        setErrorMessage(
          "There was a problem on our end. Please try again later.",
        );
        setAuth((auth) => ({ ...auth, loading: false }));
      });
  };
  return (
    <Fragment>
      <Modal
        style={{ width: 385 }}
        open={open}
        closeOnDimmerClick={false}
        closeOnDocumentClick={false}
        closeOnEscape={true}
        closeIcon={<Icon name="close" onClick={closeModal}></Icon>}
      >
        <Modal.Header>Reset Your Password</Modal.Header>
        <Modal.Content scrolling>
          <Form
            name="login-form"
            id="LoginForm"
            as={Form}
            className="m0"
            loading={auth.loading}
            onSubmit={handleSubmit}
          >
            <Grid>
              <Grid.Row className="py0">
                <Grid.Column width={16}>
                  <Form.Group className="mb0">
                    <Form.Field width={16}>
                      <label>Email</label>
                      <Input
                        fluid="true"
                        type="email"
                        name="email"
                        icon="at"
                        iconPosition="left"
                        ref={autoFocusRef}
                        value={values.email}
                        onChange={handleInputChange}
                      />
                    </Form.Field>
                  </Form.Group>
                </Grid.Column>
              </Grid.Row>
              {errorMessage && (
                <Grid.Row className="py0">
                  <Grid.Column width={16}>
                    <Message header="Error" negative>
                      <Message.Header>Error</Message.Header>
                      <Message.Content>{errorMessage}</Message.Content>
                    </Message>
                  </Grid.Column>
                </Grid.Row>
              )}

              {showSuccessMessage && (
                <Grid.Row className="py0">
                  <Grid.Column width={16}>
                    <Message header="Success" positive>
                      <Message.Header>Success!</Message.Header>
                      <Message.Content>
                        An email was sent out. <br /> Use the verification link
                        provided in the email.
                      </Message.Content>
                    </Message>
                  </Grid.Column>
                </Grid.Row>
              )}
              <Grid.Row
                className="pt16 pb8"
                divided
                centered
                textAlign="center"
              >
                <Grid.Column width={8} textAlign="center">
                  <Item
                    as={Link}
                    to="/register"
                    content="Create a New Account"
                  />
                </Grid.Column>

                <Grid.Column width={8} textAlign="center">
                  <Item
                    as={Link}
                    to="/login"
                    className="hover-pointer"
                    content="Log In"
                    onClick={closeModal}
                  ></Item>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
        </Modal.Content>

        <Modal.Actions>
          <Grid>
            <Grid.Row columns={1}>
              <Grid.Column width={16}>
                <Button
                  form="LoginForm"
                  type="submit"
                  className="save"
                  content="Confirm"
                  fluid="true"
                  loading={auth.loading}
                  disabled={values.email == "" || showSuccessMessage}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Actions>
      </Modal>
    </Fragment>
  );
};

export default withRouter(ForgotPasswordModal);
