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
  IconGroup
} from "semantic-ui-react";

import Loading from "../components/layout/Loading";
import LoadImage from "../assets/logo2.jpg";

const Home = ({ setTitle }) => {

  const minRowHeight = "30vh"
  return (
    <Segment style={{ border: "0" }}>
      <Grid centered as={Container}>
        <Grid.Row className="py0 mt16 mb0" centered style={{minHeight: "40vh"}}>
          <Grid.Column verticalAlign="middle" width={10} style={{ zIndex: 10 }}>
            <Container text textAlign="center" style={{ width: "100%" }}>
              <Header
                textAlign="center"
                as="h1"
                content="Yard Sale Manager"
                className="mb0"
              ></Header>

              <Header
                textAlign="center"
                className="pt8 mt0"
                as="h6"
                content="An inside look"
                sub
              ></Header>
            </Container>
          </Grid.Column>

          <Grid.Column width={6} textAlign="center" verticalAlign="middle">
            <Image
              rounded
              alt="Yard Sale Image"
              src={LoadImage}
              centered
              size="small"
              verticalAlign="middle"
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row className="py0 mt16 mb0">
          <Grid.Column width={16}>
            <Segment className="borderless mb0" fluid>
              <Header textAlign="center" as="h2" content="Motivation" />
            </Segment>
          </Grid.Column>
        </Grid.Row>

        {/* Cards */}
        <Grid.Row className="py0 mt16 mb0" style={{ minHeight: "30vh" }}>
          <Grid.Column mobile={8} computer={4}>
            <Segment className="rounded" fluid>
              <Header textAlign="center" as="h3" content="The Problem" />
              <p textAlign="left" className="small text">
                Manual entry is painful and leaves room for mistakes, requiring
                records to be transfered to a spreadsheet or application.
              </p>
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={8} computer={4}>
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="The Solution"
                subheader="Build a simple application to track users, sellers, yard sales and all transactions."
              />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={8} computer={4}>
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="Why not Spreadsheets?"
                subheader="They're okay for small yard sales but get complicated quickly and aren't fun to work with"
              />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={8} computer={4}>
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content=""
                subheader="Leaves no room for accounting errors."
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>

        {/* Technology | UI |*/}
        <Grid.Row className="py0 mt16 mb0">
          <Grid.Column width={16}>
            <Segment className="borderless" fluid>
              <Header
                textAlign="center"
                as="h2"
                content="Technologies: User Interface"
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>

        {/* Cards */}
        <Grid.Row className="py0 mt16 mb0" style={{ minHeight: "30vh" }}>
          <Grid.Column mobile={8} computer={4}>
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="React 16 + React Router 5"
                subheader="Built with React 16.8 && React Router 5 && Semantic-UI && Google Maps API"
              />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={8} computer={4}>
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="Functional Components, Hooks and the Context API"
                subheader=""
              />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={8} computer={4}>
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="Semantic UI + Semantic UI React + Custom Theming"
                subheader="They're okay but get complicated quickly and aren't fun to work with"
              />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={8} computer={4}>
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="Parcel Bundler"
                subheader="Smooth, efficient workflow and leaves room for mistakes"
              />
            </Segment>
          </Grid.Column>
          
        </Grid.Row>

        {/* Technology | Server & API | */}
        <Grid.Row className="py0 mt16 mb0">
          <Grid.Column width={16}>
            <Segment className="borderless" fluid>
              <Header
                textAlign="center"
                as="h2"
                content="Server & API"
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>

        {/* Cards */}
        <Grid.Row className="py0 mt16 mb0" style={{ minHeight: "30vh" }}>
          <Grid.Column mobile={8} computer={4}>
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="Python 3 + Flask"
                subheader="Built with React 16.8 && React Router 5 && Semantic-UI && Google Maps API"
              />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={8} computer={4}>
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="GraphQL"
                subheader="They're okay but get complicated quickly and aren't fun to work with"
              />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={8} computer={4}>
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="JWT for Authentication"
                subheader="Smooth, efficient workflow and leaves room for mistakes"
              />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={8} computer={4}>
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="Linode + NGINX for Staging and Production"
                subheader="room for accounting errors and leaves room for mistakes"
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>


        {/* Technology | UI |*/}
        <Grid.Row className="py0 mt16 mb0">
          <Grid.Column width={16}>
            <Segment className="borderless" fluid>
              <Header
                textAlign="center"
                as="h2"
                content="Database"
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>

        {/* Cards */}
        <Grid.Row className="py0 mt16 mb0" style={{ minHeight: "30vh" }}>
          <Grid.Column mobile={8} computer={4}>
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="Hasura (Postgres & GraphQL) on Heroku"
                subheader="Built with React 16.8 && React Router 5 && Semantic-UI && Google Maps API"
              />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={8} computer={4}>
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="Apollo Client with InMemory Cache (https & wss)"
                subheader=""
              />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={8} computer={4}>
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="Python Requests for GQL Queries from the server"
                subheader=""
              />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={8} computer={4}>
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="Strict Permissions"
                subheader="room for accounting errors and leaves room for mistakes"
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default withRouter(Home);
