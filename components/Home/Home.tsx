import { NextPage } from "next";
import Link from "next/link";

import {
  Button,
  Divider,
  Grid,
  Header,
  Item,
  ItemGroup,
  Menu,
  Segment,
} from "semantic-ui-react";
import { useAuth } from "../../hooks/useAuth";
export const Home: NextPage = () => {
  const { isAuthenticated, logout } = useAuth();
  return (
    <Segment padded basic>
      {!isAuthenticated && (
        <Grid centered>
          <Grid.Column mobile={16} tablet={8} computer={12}>
            <div className="flex col align-center">
              <Header as="h2">Welcome</Header>
              <p className="ui text">
                We can help you keep your yard sales organized.
              </p>
            </div>
          </Grid.Column>
          <Grid.Column
            textAlign="right"
            verticalAlign="middle"
            mobile={16}
            tablet={8}
            computer={4}
          >
            <Segment raised>
              <ItemGroup divided>
                <Item>
                  <Link href="/login" as="/login">
                    <Button fluid primary>
                      Log In
                    </Button>
                  </Link>
                </Item>
                <Item>
                  <Link href="/register" as="/register">
                    <Button fluid>Register</Button>
                  </Link>
                </Item>
              </ItemGroup>
            </Segment>
          </Grid.Column>
          <Grid.Row>
            <div className="flex col align-center">
              {/* <Header as="h2"></Header>
              <p className="ui text">We can help you keep your yard sales organized.</p> */}
            </div>
          </Grid.Row>
          <Divider></Divider>
        </Grid>
      )}

      {isAuthenticated && (
        <Grid centered>
          <Grid.Column mobile={16} tablet={8} computer={12}>
            <Header as="h2" textAlign="center">Welcome</Header>
            <p className="ui text">It looks like you are logged in. This page will eventually show a full summary of your account.</p>
          </Grid.Column>
          <Grid.Column
            textAlign="right"
            verticalAlign="middle"
            mobile={16}
            tablet={8}
            computer={4}
            floated="left"
          ></Grid.Column>
        </Grid>
      )}
    </Segment>
  );
};
