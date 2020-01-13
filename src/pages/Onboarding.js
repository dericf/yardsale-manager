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
  Popup
} from "semantic-ui-react";

import Loading from "../components/layout/Loading";
import LoadImage from "../assets/logo2.jpg";
import { AuthContext } from "../App";
import YardsaleSellerModal from "../components/modals/YardsaleSellerModal/YardsaleSellerModal";
import SellerDetailsModal from "../components/modals/SellerDetailsModal/SellerDetailsModal";
import YardsaleDetailsModal from "../components/modals/YardsaleDetailsModal/YardsaleDetailsModal";
import { GET_USER } from "../graphql/queries";
import { useQuery } from "@apollo/react-hooks";

const OnBoarding = ({ setTitle, ...props }) => {
  const { auth, setAuth } = React.useContext(AuthContext);
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

  return (
    <Segment className="borderless" style={{ width: "100%" }}>
      <Grid centered padded divided fluid className="mr0">
        {sectionsCompleted.all === true ? (
          <Fragment>
            <Grid.Row
              className="py0 mt16 mb0"
              style={{ height: "25vh" }}
              centered
            >
              {/* Last Section */}

              <Grid.Column
                mobile={8}
                computer={12}
                style={{ zIndex: 10 }}
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
                          <Label size="massive" basic className="borderless">
                            You're all set!
                          </Label>
                          <Label size="massive" basic className="borderless">
                            Look for the help icons throughout if you get stuck
                            (
                            <Popup
                              inverted
                              header="A Basic Info Popup"
                              content={
                                <p className="text">
                                  This is a basic info popup
                                </p>
                              }
                              trigger={
                                <Icon
                                  name="info circle"
                                  fitted
                                  className="info-popup-icon"
                                />
                              }
                            ></Popup>
                            ).
                          </Label>
                        </Form.Field>
                      </Form.Group>
                    </Form>
                  </Segment>
                </Container>
              </Grid.Column>

              <Grid.Column mobile={8} computer={4} textAlign="center" verticalAlign="middle">
                <Icon
                  name="check circle outline"
                  color="green"
                  size="massive"
                  success
                ></Icon>
              </Grid.Column>
            </Grid.Row>

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
                <Button icon="users" labelPosition="left" content="Go to My Sellers" onClick={() => props.history.push('/sellers')} />
              </Grid.Column>

              <Grid.Column
                mobile={16}
                computer={5}
                style={{ zIndex: 10 }}
                verticalAlign="middle"
              >
                <Button icon="signs map" labelPosition="left" content="Go to My Yard Sales" onClick={() => props.history.push('/yardsales')} />
              </Grid.Column>

              <Grid.Column
                mobile={16}
                computer={5}
                style={{ zIndex: 10 }}
                verticalAlign="middle"
              >
                <Button icon="home" labelPosition="left" content="Read the Blog" onClick={() => props.history.push('/')} />
              </Grid.Column>

            </Grid.Row>
          </Fragment>
        ) : (
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
                      size="massive"
                      subheader="Free and Simple"
                      content="Welcome to Yard Sale Manager and Market"
                    />
                  </Segment>
                </Container>
              </Grid.Column>
            </Grid.Row>

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
                          {sectionsCompleted.userAsSeller == true ? (
                            <Icon name="checkmark" color="green" size="large" />
                          ) : (
                            <Fragment>
                              <Label
                                size="massive"
                                basic
                                className="borderless"
                              >
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
                                circular
                                basic
                                cancel
                                onClick={() =>
                                  setSectionsComplete({
                                    ...sectionsCompleted,
                                    userAsSeller: true
                                  })
                                }
                              />

                              <Fragment>
                                <SellerDetailsModal
                                  userAsSeller={
                                    userData && userData.user
                                      ? userData.user[0]
                                      : {
                                          name: "test name",
                                          initials: "TN",
                                          email: "test@email.com"
                                        }
                                  }
                                  onCloseCallback={() => {
                                    console.log("Callback for onClose");
                                    setSectionsComplete({
                                      ...sectionsCompleted,
                                      userAsSeller: true
                                    });
                                  }}
                                >
                                  {({ openModal }) => (
                                    <Button
                                      icon="check"
                                      content="Yes"
                                      circular
                                      basic
                                      primary
                                      onClick={openModal}
                                    />
                                  )}
                                </SellerDetailsModal>
                              </Fragment>
                            </Fragment>
                          )}
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

            {sectionsCompleted.userAsSeller === true &&
              sectionsCompleted.otherSellers !== false && (
                <Grid.Row className="py0 mt16 mb0" style={{ height: "25vh" }}>
                  {/* Add other Sellers */}
                  <Grid.Column
                    width={12}
                    style={{ zIndex: 10 }}
                    textAlign="center"
                    verticalAlign="middle"
                  >
                    <Container
                      text
                      textAlign="center"
                      style={{ width: "100%" }}
                    >
                      <Segment
                        textAlign="center"
                        style={{ width: "100%" }}
                        className="borderless"
                      >
                        <Form>
                          <Form.Group>
                            <Form.Field>
                              {sectionsCompleted.otherSellers == true && (
                                <Icon
                                  name="checkmark"
                                  color="green"
                                  size="large"
                                />
                              )}
                              <Fragment>
                                <Label
                                  size="massive"
                                  basic
                                  className="borderless"
                                >
                                  Would you like to add more Sellers now?
                                </Label>
                                <br />
                                <Button
                                  icon="close"
                                  content="No"
                                  circular
                                  basic
                                  cancel
                                  onClick={() =>
                                    setSectionsComplete({
                                      ...sectionsCompleted,
                                      otherSellers: false
                                    })
                                  }
                                />

                                <Fragment>
                                  <SellerDetailsModal
                                    onCloseCallback={() => {
                                      setSectionsComplete({
                                        ...sectionsCompleted,
                                        otherSellers: true
                                      });
                                    }}
                                  >
                                    {({ openModal }) => (
                                      <Button
                                        icon="add"
                                        content="Add Seller"
                                        circular
                                        basic
                                        primary
                                        onClick={openModal}
                                      />
                                    )}
                                  </SellerDetailsModal>
                                </Fragment>
                              </Fragment>
                            </Form.Field>
                          </Form.Group>
                        </Form>
                      </Segment>
                    </Container>
                  </Grid.Column>

                  <Grid.Column
                    width={4}
                    textAlign="center"
                    verticalAlign="middle"
                  >
                    <Icon name="users" size="huge"></Icon>
                    <Icon corner size="large" name="add" />
                  </Grid.Column>
                </Grid.Row>
              )}

            {(sectionsCompleted.userAsSeller === true &&
              sectionsCompleted.otherSellers === true) ||
              (sectionsCompleted.otherSellers === false && (
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
                    <Container
                      text
                      textAlign="center"
                      style={{ width: "100%" }}
                    >
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
                                    circular
                                    basic
                                    cancel
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
                                      {/* TODO: Mutation to set has_completed_onboarding = true */}
                                    }}
                                  >
                                    {({ openModal }) => (
                                      <Button
                                        icon="add"
                                        content="Add Yardsale"
                                        circular
                                        basic
                                        primary
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
              ))}
          </Fragment>
        )}
      </Grid>
    </Segment>
  );
};

export default withRouter(OnBoarding);
