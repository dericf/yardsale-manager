import React, { Fragment, useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  Segment,
  Grid,
  Divider,
  Loader,
  Dimmer,
  Container,
  Message,
  Header,
  Image,
  Icon,
  IconGroup,
  Form,
  Radio,
  Label,
  Button,
  Popup,
  Step
} from "semantic-ui-react";

import Loading from "../components/layout/Loading";
import LoadImage from "../assets/logo2.jpg";
import { AuthContext, AppContext } from "../App";
import YardsaleSellerModal from "../components/modals/YardsaleSellerModal/YardsaleSellerModal";
import SellerDetailsModal from "../components/modals/SellerDetailsModal/SellerDetailsModal";
import YardsaleDetailsModal from "../components/modals/YardsaleDetailsModal/YardsaleDetailsModal";
import { GET_USER } from "../graphql/queries";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { UPDATE_USER_ONBOARDING } from "../graphql/mutations";

const OnBoarding = ({ setTitle, ...props }) => {
  const { auth, setAuth } = React.useContext(AuthContext);
  const { app, setApp } = React.useContext(AppContext);
  const { loading, error, data: userData } = useQuery(GET_USER);

  const defaultSectionsCompleted = {
    userAsSeller: null,
    otherSellers: null,
    firstYardsale: null,
    all: null
  };
  const [sectionsCompleted, setSectionsComplete] = useState(
    defaultSectionsCompleted
  );

  const [sellers, setSellers] = useState([]);
  const [yardsales, setYardsales] = useState([]);
  const [userAsSeller, setUserAsSeller] = useState(null);


  const [updateUserOnboarding] = useMutation(UPDATE_USER_ONBOARDING)

  const handleOnboardingComplete = () => {
    const {loading, error } = updateUserOnboarding({variables: {UUID: auth.user.uuid}})
  }
  
  useEffect(() => {
    console.log('Secctions completed has changed...', sectionsCompleted)
    if (sectionsCompleted.all === true) {
      handleOnboardingComplete()
    }
  }, [sectionsCompleted])

  return (
    <Segment className="borderless" style={{ width: "100%" }}>
      <Grid centered padded divided fluid className="mr0">
        <Fragment>
          <Grid.Row className="py0 mt16 mb0">
            <Grid.Column width={16} style={{ zIndex: 10 }}>
              <Container text textAlign="center" style={{ width: "100%" }}>
                <Segment
                  textAlign="center"
                  style={{ width: "100%" }}
                  className="borderless"
                >
                  <Header
                    as="h1"
                    className="header"
                    size="huge"
                    subheader="Lets get your account set up"
                    content="Welcome to Yard Sale Manager"
                  />
                </Segment>
              </Container>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Step.Group widths={3}>
              <Step active={!sectionsCompleted.userAsSeller}>
                <Icon
                  name={
                    sectionsCompleted.userAsSeller === true ? "check" : "user"
                  }
                  color={sectionsCompleted.userAsSeller && "green"}
                />
                <Step.Content>
                  <Step.Title>First Seller</Step.Title>
                </Step.Content>
              </Step>
              <Step
                active={
                  sectionsCompleted.userAsSeller &&
                  !sectionsCompleted.firstYardsale
                }
              >
                <Icon
                  name={
                    sectionsCompleted.firstYardsale === true
                      ? "check"
                      : "map signs"
                  }
                  color={sectionsCompleted.firstYardsale && "green"}
                />
                <Step.Content>
                  <Step.Title>First Yardsale</Step.Title>
                </Step.Content>
              </Step>
              <Step active={sectionsCompleted.all}>
                <Icon name="check" color={sectionsCompleted.all && "green"} />
                <Step.Content>
                  <Step.Title>Done</Step.Title>
                </Step.Content>
              </Step>
            </Step.Group>
          </Grid.Row>

          {!sectionsCompleted.userAsSeller && (
            <Grid.Row
              className="py0 mt16 mb0"
              style={{ height: "25vh" }}
              centered
            >
              {/* User as Seller */}
              <Grid.Column
                width={12}
                style={{ zIndex: 10 }}
                textAlign="center"
                verticalAlign="middle"
              >
                <Container text textAlign="center" style={{ width: "100%" }}>
                  <Segment
                    textAlign="center"
                    style={{ width: "100%" }}
                    className="borderless"
                  >
                    <Form>
                      <Form.Group>
                        <Form.Field>
                          <Fragment>
                            <Label size="massive" basic className="borderless">
                              Would you like to add yourself (
                              {userData && userData.user ? (
                                userData.user[0].email
                              ) : (
                                <Icon name="spinner" fitted loading />
                              )}
                              ) as a Seller?
                            </Label>
                            <br />
                            <Button
                              icon="close"
                              content="No"
                              className="cancel"
                              onClick={() =>
                                setSectionsComplete({
                                  ...sectionsCompleted,
                                  userAsSeller: true
                                })
                              }
                            />

                            <Fragment>
                              {!loading && userData && (
                                <SellerDetailsModal
                                  userAsSeller={
                                    userData && userData.user
                                      ? userData.user[0]
                                      : {
                                          name: "",
                                          initials: "",
                                          email: ""
                                        }
                                  }
                                  onCloseCallback={() => {
                                    console.log("Callback for onClose");
                                    setSectionsComplete({
                                      ...sectionsCompleted,
                                      userAsSeller: true,
                                      otherSellers: true
                                    });
                                  }}
                                >
                                  {({ openModal }) => (
                                    <Button
                                      icon="check"
                                      content="Yes"
                                      className="save"
                                      onClick={openModal}
                                    />
                                  )}
                                </SellerDetailsModal>
                              )}
                            </Fragment>
                          </Fragment>
                        </Form.Field>
                      </Form.Group>
                    </Form>
                  </Segment>
                </Container>
              </Grid.Column>

              <Grid.Column width={4} textAlign="center" verticalAlign="middle">
                <Icon name="user" size="huge"></Icon>
                <Icon corner size="large" name="add" />
              </Grid.Column>
            </Grid.Row>
          )}

          {sectionsCompleted.userAsSeller === true &&
            !sectionsCompleted.firstYardsale && (
              <Grid.Row className="py0 mt16 mb0" style={{ height: "25vh" }}>
                {/* First Yardsale */}
                <Grid.Column
                  width={4}
                  textAlign="center"
                  verticalAlign="middle"
                >
                  <Icon name="map signs" size="huge"></Icon>
                  <Icon corner size="large" name="add" />
                </Grid.Column>
                <Grid.Column
                  width={12}
                  style={{ zIndex: 10 }}
                  verticalAlign="middle"
                  textAlign="center"
                >
                  <Container text textAlign="center" style={{ width: "100%" }}>
                    <Segment
                      textAlign="center"
                      style={{ width: "100%" }}
                      className="borderless"
                    >
                      <Form>
                        <Form.Group>
                          <Form.Field>
                            {yardsales.length > 0 ||
                            sectionsCompleted.firstYardsale ? (
                              <Icon
                                name="checkmark"
                                color="green"
                                size="large"
                              />
                            ) : (
                              <Label
                                size="massive"
                                basic
                                className="borderless"
                              >
                                Would you like to create your first Yard Sale?{" "}
                                <br />
                                <br />
                                <Button
                                  icon="close"
                                  content="No"
                                  className="cancel"
                                  onClick={() =>
                                    setSectionsComplete({
                                      ...sectionsCompleted,
                                      firstYardsale: true,
                                      all: true
                                    })
                                  }
                                />
                                <YardsaleDetailsModal
                                  onCloseCallback={() => {
                                    setSectionsComplete({
                                      ...sectionsCompleted,
                                      firstYardsale: true,
                                      all: true
                                    });
                                    {
                                      /* TODO: Mutation to set has_completed_onboarding = true */
                                    }
                                  }}
                                >
                                  {({ openModal }) => (
                                    <Button
                                      icon="add"
                                      content="Add Yardsale"
                                      className="save"
                                      onClick={openModal}
                                    />
                                  )}
                                </YardsaleDetailsModal>
                              </Label>
                            )}
                          </Form.Field>
                        </Form.Group>
                      </Form>
                    </Segment>
                  </Container>
                </Grid.Column>
              </Grid.Row>
            )}

          {/* DONE */}
          {sectionsCompleted.all === true && (
            <Fragment>
              <Grid.Row
                className="py0 mt16 mb0"
                style={{ height: "25vh" }}
                centered
              >
                {/* Last Section */}

                <Grid.Column
                  mobile={16}
                  computer={16}
                  style={{ zIndex: 10 }}
                  verticalAlign="middle"
                >
                  <Container text textAlign="center" style={{ width: "100%" }}>
                    <Segment
                      textAlign="center"
                      style={{ width: "100%" }}
                      className="borderless"
                    >
                      
                    <Header size="large" basic className="borderless" textAlign="center">
                      You're all set!
                    </Header>
                    <Header size="small" basic className="borderless" textAlign="center">
                      Look for the help icons throughout if you get
                      stuck (
                      <Popup
                        wide
                        inverted
                        hoverable
                        header="This is an Info Popup"
                        content={
                          <p className="text">
                            It can contain helpful information about a particular action or section.
                            <br /> 
                            <br />
                            Please use the <Link onClick={() => (setApp({...app, showFeedbackModal: true}))}>Feedback</Link> section to report any errors or request any new features.
                          </p>
                        }
                        trigger={
                          <Icon
                            name="help circle"
                            fitted
                            size="small"
                            className="info-popup-icon"
                          />
                        }
                      ></Popup>
                      ).
                    </Header>

                    </Segment>
                  </Container>
                </Grid.Column>
              </Grid.Row>
              <Grid stackable style={{width: "100%"}}>
                <Grid.Row
                  className="py0 mt16 mb0"
                  style={{ height: "10vh" }}
                  centered
                >
                  <Grid.Column
                    mobile={16}
                    computer={5}
                    style={{ zIndex: 10 }}
                    verticalAlign="middle"
                  >
                    <Button
                      fluid
                      icon="users"
                      labelPosition="left"
                      content="Go to My Sellers"
                      onClick={() => props.history.push("/sellers")}
                    />
                  </Grid.Column>

                  <Grid.Column
                    mobile={16}
                    computer={5}
                    style={{ zIndex: 10 }}
                    verticalAlign="middle"
                  >
                    <Button
                      fluid
                      icon="signs map"
                      labelPosition="left"
                      content="Go to My Yard Sales"
                      onClick={() => props.history.push("/yardsales")}
                    />
                  </Grid.Column>

                  <Grid.Column
                    mobile={16}
                    computer={5}
                    style={{ zIndex: 10 }}
                    verticalAlign="middle"
                  >
                    <Button
                      fluid
                      icon="home"
                      labelPosition="left"
                      content="Read the Blog"
                      onClick={() => props.history.push("/")}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Fragment>
          )}
        </Fragment>
      </Grid>
    </Segment>
  );
};

export default withRouter(OnBoarding);
