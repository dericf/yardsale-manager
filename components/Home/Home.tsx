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
          <Grid.Column mobile={16} tablet={8} computer={12} floated="left">
            <Header as="h2">Welcome</Header>
            <p className="ui text">Let's get you started</p>
          </Grid.Column>
          <Grid.Column
            textAlign="right"
            verticalAlign="middle"
            mobile={16}
            tablet={8}
            computer={4}
            floated="left"
          >
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
          </Grid.Column>
        </Grid>
      )}

      {isAuthenticated && (
        <Grid centered>
          <Grid.Column mobile={16} tablet={8} computer={12} floated="left">
            <Header as="h2">Summary</Header>
            <p className="ui text"></p>
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
