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

import { AuthContext, checkRefreshInterval } from "../../../AuthContext";

import RegisterModal from "../RegisterModal/RegisterModal";

const LoginModal = ({
  defaultOpen = true,
  forcedOpen = false,
  noTrigger = false,
  ...props
}) => {
  // TODO: (Future) make this more responsive. Add more than just two widths
  // const nameRef = createRef()
  const { auth, setAuth } = React.useContext(AuthContext);
  const client = props.client;
  const autoFocusRef = useRef();
  const initialValues = {
    email: "",
    password: "",
  };
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(defaultOpen);
  const [values, setValues] = useState(initialValues);
  const [errorMessage, setErrorMessage] = useState(null);

  const closeModal = (e, withRedirect = true, override = false) => {
    console.log("Closing modal...", override, forcedOpen);
    if (forcedOpen === true && override === true) {
      return false;
    }
    setOpen(false);
    setAuth((auth) => ({
      ...auth,
      loading: false,
    }));

    if (withRedirect === true) {
      props.history.replace("/yardsales");
    }
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

  useEffect(() => {
    if (auth.redirectToAfterLogin !== null) {
      setLoading(false);
      closeModal(false, true);
      history.go(auth.redirectToAfterLogin);
    }
  }, [auth]);

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
    setLoading(true);
    let uri = `${BASE_URL}/auth/login`;
    let data = {
      email: values.email,
      password: values.password,
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
        if (
          json.STATUS === "OK" &&
          json.token !== "" &&
          json.refreshToken != ""
        ) {
          //
          // TODO: This should be changed to not use localStorage eventually
          //
          localStorage.setItem("accessToken", json.token);
          localStorage.setItem("refreshToken", json.refreshToken);
          localStorage.setItem("user", JSON.stringify(json.user));
          setValues(initialValues);
          //
          // Update Auth Context
          //
          const intervalID = setInterval(() => {
            checkRefreshInterval(auth, setAuth, history);
          }, 3000);

          setAuth((auth) => ({
            ...auth,
            loading: false,
            reAuthenticateRequired: false,
            refreshTokenIntervalFunction: intervalID,
            redirectToAfterLogin: "/yardsales",
            isAuthenticated: true,
            isLoggedIn: true,
            user: json.user,
            token: json.token,
          }));

          // TODO : server should also return some of the user fields so here we can check if the user
          // has completed the onboarding process or not. If not: redirect to the /welcome page. otherwise redirect to yardsales (or sellers... can't decide.)
          // setTimeout(() => {
          //   if (json.user.has_completed_onboarding === false) {
          //     console.log(
          //       "ONBOARDING FALSE: ",
          //       json.user,
          //       json.user.has_completed_onboarding,
          //     );
          //     props.history.push("/welcome");
          //   } else {
          //     console.log(
          //       "ONBOARDING TRUE: ",
          //       json.user,
          //       json.user.has_completed_onboarding,
          //     );
          //     props.history.push("/yardsales");
          //   }
          // }, 500);

          // window.location.assign('/yardsales')
          // window.location.assign(json.callback)
          //   closeModal();
        } else if (json.STATUS === "ERROR") {
          // console.log('Bad Login Credentials', json)
          if (json.MESSAGE === "User not found") {
            // console.log('User not found', json)
            setAuth((auth) => ({
              ...auth,
              loading: false,
              reAuthenticateRequired: false,
            }));
            setLoading(false);
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
            setLoading(false);
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
            setLoading(false);
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
        setLoading(false);
      });
  };

  return (
    <Fragment>
      {/* {props.children ? (openModal => (props.children)
      ) : (
        <Fragment>
      )} */}

      {noTrigger === false && (
        <Menu.Item
          as="a"
          index={0}
          content="Login"
          className="horizontal"
          onClick={openModal}
        />
      )}
      <Modal
        style={{ width: 385 }}
        open={open}
        closeIcon={auth.user && <Icon name="close" onClick={closeModal}></Icon>}
        dimmer={"blurring"}
        onClose={closeModal}
        closeOnDimmerClick={true}
        closeOnEscape={true}
      >
        <Modal.Header>Log In</Modal.Header>
        <Modal.Content scrolling>
          <Form
            name="login-form"
            id="LoginForm"
            as={Form}
            className="m0"
            loading={loading}
            onSubmit={handleSubmit}
          >
            <Grid>
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
                        value={values.email}
                        onChange={handleInputChange}
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
                        value={values.password}
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
              <Grid.Row className="pb8 pt16" divided centered>
                <Grid.Column width={8} textAlign="left">
                  <Item
                    as={Link}
                    to="/register"
                    content="Create a New Account"
                  />
                </Grid.Column>

                <Grid.Column width={8} textAlign="right">
                  <Item
                    as={Link}
                    to="/request-change-password"
                    className="hover-pointer"
                    content="Forgot your password?"
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
                  content="Log In"
                  fluid={true}
                  loading={loading}
                  disabled={
                    values.email == "" ||
                    values.password == "" ||
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

export default withRouter(LoginModal);
