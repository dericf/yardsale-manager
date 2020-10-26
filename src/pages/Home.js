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
      <Grid centered as={Container} stackable>
        <Grid.Row className="py0 mt16 mb0" centered style={{minHeight: "40vh"}}>
          <Grid.Column verticalAlign="middle" width={10} style={{ zIndex: 10 }}>
            <Container as={Segment} raised text textAlign="center" style={{ width: "100%" }}>
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
          <Grid.Column width={8}>
            <Segment className="borderless mb0" fluid>
              <Header textAlign="center" as="h2" content="Motivation" />
            </Segment>
          </Grid.Column>
        </Grid.Row>

        {/* Cards */}
        <Grid.Row className="py16 mt16 mb0" style={{ minHeight: "30vh" }}>
          <Grid.Column mobile={8} computer={8} className="my16">
            <Segment className="rounded" fluid raised>
              <Header textAlign="left" as="h3" content="The Goal" />
              <p  className="small text">
                The original goal of Yardsale Manager was to build a web application that could track users, yardsales, sellers and transactions, while displaying totals for each seller and each yard sale.

              </p>
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={8} computer={8} className="my16">
            <Segment className="rounded" fluid raised>
              <Header
                textAlign="left"
                as="h3"
                content="The Result"
              />
                <p  className="small text">
                  Build a simple application to track Users, Sellers, Yard Sales and all Transactions.
                  Still in the development pipeline are features such as Seller/Yard Sale Items, with optional public listing (similar to an auction).
                </p>
            </Segment>
          </Grid.Column>
        </Grid.Row>

        {/* Technology | UI |*/}
        <Grid.Row className="py0 mt16 mb0">
          <Grid.Column width={8} className="my16">
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
          <Grid.Column mobile={16} computer={8} className="my16">
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="React 16 + React Router 5"
                subheader="Built with React 16.8 && React Router 5 && Semantic-UI && Google Maps API"
              />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={16} computer={8} className="my16">
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="Functional Components, Hooks and the Context API"
              />
              <p className="small text" >
              </p>
                <pre><code>
                {`export const AppContext = React.createContext([
  defaultAppContext,
  () => defaultAppContext
]);

const [app, setApp] = useState(defaultAppContext);`}
</code></pre>
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={16} computer={8} className="my16">
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="Semantic UI + Semantic UI React + Custom Theming"
                subheader="They're okay but get complicated quickly and aren't fun to work with"
              />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={16} computer={8} className="my16">
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="SCSS"
                subheader=""
              />
            </Segment>
          </Grid.Column>
          
        </Grid.Row>

        {/* Technology | Server & API | */}
        <Grid.Row className="py0 mt16 mb0">
          <Grid.Column width={16} className="my16">
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
          <Grid.Column mobile={8} computer={4} className="my16">
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="Python 3 + Flask"
                subheader="Built with React 16.8 && React Router 5 && Semantic-UI && Google Maps API"
              />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={8} computer={4} className="my16">
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="GraphQL"
              />

              <p className="small text">
                {`using
                `}
              </p>
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={8} computer={4} className="my16">
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="JWT for Authentication"
                subheader="Smooth, efficient workflow and leaves room for mistakes"
              />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={8} computer={4} className="my16">
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


        {/* Technology | DB |*/}
        <Grid.Row className="py0 mt16 mb0">
          <Grid.Column width={16} className="my16">
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
          <Grid.Column mobile={16} computer={16} className="my16">
            
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="Hasura (Postgres & GraphQL) on Heroku"
                subheader="Built with React 16.8 && React Router 5 && Semantic-UI && Google Maps API"
              />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={16} computer={16} className="my16">
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="Apollo Client with InMemory Cache (https & wss)"
                subheader=""
              />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={16} computer={16} className="my16">
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="Python Requests for GQL Queries from the server"
                subheader=""
              />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={16} computer={16} className="my16">
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

        {/* Technology | DB |*/}
        <Grid.Row className="py0 mt16 mb0">
          <Grid.Column width={16} className="my16">
            <Segment className="borderless" fluid>
              <Header
                textAlign="center"
                as="h2"
                content="Tooling"
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>

        {/* Cards */}
        <Grid.Row className="py0 mt16 mb0" style={{ minHeight: "30vh" }}>
          <Grid.Column mobile={16} computer={8} className="my16">
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="VS Code"
                subheader=""
              />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={16} computer={8} className="my16">
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="Parcel Bundler"
                subheader=""
              />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={16} computer={8} className="my16">
            <Segment className="rounded" fluid >
              <Header
                textAlign="left"
                as="h3"
                content="Github"
                subheader=""
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>

        {/* Technology | Deployment |*/}
        <Grid.Row className="py0 mt16 mb0">
          <Grid.Column width={16} className="my16">
            <Segment className="borderless" fluid>
              <Header
                textAlign="center"
                as="h2"
                content="Deployment"
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>

        {/* Cards */}
        <Grid.Row className="py0 mt16 mb0" style={{ minHeight: "30vh" }}>
          <Grid.Column mobile={16} computer={8} className="my16">
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="Linode Server"
                subheader=""
              />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={16} computer={8} className="my16">
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="NGINX"
                subheader=""
              />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={16} computer={8} className="my16">
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="Certbot"
                subheader=""
              />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={16} computer={8} className="my16">
            <Segment className="rounded" fluid>
              <Header
                textAlign="left"
                as="h3"
                content="Supervisor"
                subheader=""
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default withRouter(Home);
