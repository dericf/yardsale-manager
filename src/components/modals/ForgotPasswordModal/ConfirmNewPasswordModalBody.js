import React, {
  Component,
  Fragment,
  useState,
  createRef,
  useEffect,
  useRef,
} from "react";
import { Link, withRouter } from "react-router-dom";
import { useParams } from "react-router";
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

import { AuthContext } from "../../../App";

const ConfirmNewPasswordModalBody = ({
  defaultOpen = true,
  forcedOpen = true,
  ...props
}) => {
  let { resetCode, uuid } = useParams(); //props.match.params
  console.log("PARAMS: ", resetCode, uuid);
  const { auth, setAuth } = React.useContext(AuthContext);
  const autoFocusRef = useRef();
  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const [open, setOpen] = useState(defaultOpen);
  const [values, setValues] = useState(initialValues);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(null);

  const closeModal = () => {
    setOpen(false);
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
    let uri = `${BASE_URL}/auth/complete-change-password`;
    let data = {
      new_password: values.password,
      confirm_new_password: values.confirmPassword,
      reset_code: resetCode,
      uuid: uuid,
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
          setTimeout(() => {
            props.history.push("/login");
          }, 2500);
        } else if (json.STATUS === "ERROR") {
          setShowSuccessMessage(false);
          setAuth((auth) => ({
            ...auth,
            loading: false,
          }));
          if (json.MESSAGE === "User not found") {
            setAuth((auth) => ({
              ...auth,
              loading: false,
            }));
            autoFocusRef.current.focus();
            setErrorMessage(
              "No user was found matching that email. Please try again.",
            );
          } else if (json.MESSAGE === "Reset code does not match") {
            setErrorMessage("Password does not match. Please try again.");
            setAuth((auth) => ({
              ...auth,
              loading: false,
            }));
          } else if (json.MESSAGE === "Passwords do not match") {
            setErrorMessage("Passwords do not match. Please try again.");
            setAuth((auth) => ({
              ...auth,
              loading: false,
            }));
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
        dimmer={false}
      >
        <Modal.Header>Reset Your Password</Modal.Header>
        <Modal.Content scrolling>
          <Form
            name="login-form"
            id="ConfirmNewPasswordForm"
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
                      <Popup
                        inverted
                        position="top left"
                        content={
                          (values.password !== values.confirmPassword ||
                            values.password.length < 6) &&
                          "Password needs to be at least 6 characters (preferably greater than 10)"
                        }
                        trigger={
                          <label className="info-popup-icon">
                            Password <Icon name="help circle" />
                          </label>
                        }
                      />
                      <Input
                        fluid="true"
                        type="password"
                        name="password"
                        icon="key"
                        iconPosition="left"
                        ref={autoFocusRef}
                        value={values.password}
                        onChange={handleInputChange}
                      />
                    </Form.Field>

                    <Form.Field width={16}>
                      <label>ConfirmPassword</label>
                      <Input
                        fluid="true"
                        type="password"
                        name="confirmPassword"
                        icon="key"
                        iconPosition="left"
                        value={values.confirmPassword}
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
                        Your password has been updated.
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
                <Grid.Column width={8}>
                  <Item
                    as={Link}
                    to="/register"
                    content="Create a New Account"
                  />
                </Grid.Column>

                <Grid.Column width={8} textAlign="Left">
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
                  form="ConfirmNewPasswordForm"
                  type="submit"
                  className="save"
                  content="Confirm"
                  fluid="true"
                  loading={auth.loading}
                  disabled={
                    values.password !== values.confirmPassword ||
                    values.password.length < 6
                  }
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Actions>
      </Modal>
    </Fragment>
  );
};

export default withRouter(ConfirmNewPasswordModalBody);
