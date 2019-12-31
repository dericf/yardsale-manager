import React, {
  Component,
  Fragment,
  useState,
  createRef,
  useEffect,
  useRef
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
  Item
} from "semantic-ui-react";

// Apollo/GQL

// Toast Notification
import { notify } from "react-notify-toast";

import { BASE_URL } from "../../../constants";
import { FakeDataContext } from "../../../App";

import { AuthContext } from "../../../App";

const RegisterModal = ({
  defaultOpen = false,
  forcedOpen = false,
  ...props
}) => {
  // TODO: (Future) make this more responsive. Add more than just two widths
  // const nameRef = createRef()
  const { auth, setAuth } = React.useContext(AuthContext);
  const client = props.client;
  const autoFocusRef = useRef();
  const initialValues = {
    name: "",
    initials: "",
    email: "",
    password: "",
    confirmPassword: ""
  };

  const [open, setOpen] = useState(defaultOpen);
  const [values, setValues] = useState(initialValues);
  const [errorMessage, setErrorMessage] = useState(null);

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

  const handleInputChange = event => {
    // TODO: Move this to a hook
    const target = event.target;
    const val = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setValues({
      ...values,
      [name]: val
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setAuth({ ...auth, loading: true });
    let uri = `${BASE_URL}/auth/register`;
    let data = {
      name: values.name,
      initials: values.initials,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword
    };
    let options = {
      method: "POST",
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    fetch(uri, options)
      .then(res => {
        return res.json();
      })
      .then(json => {
        if (
          json.STATUS === "OK" &&
          json.token !== "" &&
          json.refreshToken != ""
        ) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setValues(initialValues);
          // props.history.push('/yardsales')
          setAuth(auth => ({ ...auth, reAuthenticateRequired: false }));
          props.history.push("/sellers");
          closeModal();
        } else if (json.STATUS === "ERROR") {
          // console.log('Bad Login Credentials', json)
          if (
            json.MESSAGE ===
            "An account with that email already exists. Please try again."
          ) {
            // console.log('Account with that email already exists', json)
            setAuth(auth => ({
              ...auth,
              loading: false,
              reAuthenticateRequired: false
            }));
            autoFocusRef.current.focus();
            setErrorMessage(
              "An account with that email already exists. Please try again."
            );
          }
        }
      })
      .catch(err => {
        // console.log('ERROR', err)
        setErrorMessage(
          "There was a problem on our end. Please try again later."
        );
        setAuth(auth => ({ ...auth, loading: false }));
      });
  };

  return (
    <Fragment>
      <Menu.Item
        tabindex="-1"
        as="a"
        index={0}
        content="Create a New Account"
        className="horizontal hover-pointer"
        onClick={openModal}
      />

      <Modal
        style={{ width: 350 }}
        open={open}
        closeOnDimmerClick={false}
        closeOnDocumentClick={false}
        closeOnEscape={true}
        dimmer="inverted"
      >
        <Modal.Header>Create a New Account</Modal.Header>
        <Modal.Content scrolling>
          <Form
            name="register-form"
            id="RegisterForm"
            onSubmit={handleSubmit}
            as={Form}
            className="m0"
            loading={auth.loading}
          >
            <Grid>
              <Grid.Row className="py0">
                <Grid.Column width={10}>
                  <Form.Group>
                    <Form.Field width={16}>
                      <label>Name (optional)</label>
                      <Input
                        fluid
                        type="text"
                        name="name"
                        icon="user"
                        iconPosition="left"
                        ref={autoFocusRef}
                        value={values.name}
                        onChange={handleInputChange}
                      />
                    </Form.Field>
                  </Form.Group>
                </Grid.Column>
                <Grid.Column width={6}>
                  <Form.Group>
                    <Form.Field width={16}>
                      <label>Initials</label>
                      <Input
                        fluid
                        type="text"
                        name="initials"
                        icon="id badge"
                        iconPosition="left"
                        value={values.initials}
                        onChange={handleInputChange}
                      />
                    </Form.Field>
                  </Form.Group>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row className="py0">
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
                        value={values.email}
                        onChange={handleInputChange}
                      />
                    </Form.Field>
                  </Form.Group>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row className="py0">
                <Grid.Column width={16}>
                  <Form.Group>
                    <Form.Field width={16}>
                      <label>Password</label>
                      <Input
                        fluid
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
              <Grid.Row className="py0">
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
              <Grid.Row className="py0">
                <Grid.Column>
                  <Item
                    as={Link}
                    to="/login"
                    className="hover-pointer"
                    content="Already have an account? Log in."
                    onClick={closeModal}
                  ></Item>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
        </Modal.Content>

        <Modal.Actions>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column width={8}>
                <Button
                  onClick={closeModal}
                  negative
                  fluid
                  disabled={forcedOpen}
                >
                  Cancel
                </Button>
              </Grid.Column>

              <Grid.Column width={8}>
                <Button
                  form="RegisterForm"
                  type="submit"
                  positive
                  content="Confirm"
                  fluid
                  loading={auth.loading}
                  disabled={
                    values.email == "" ||
                    values.password == "" ||
                    values.password.length < 4 ||
                    values.password !== values.confirmPassword
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

export default withRouter(RegisterModal);
