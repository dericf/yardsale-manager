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
import { Layout } from "../components/layout/Layout";
import { useAuth } from "../hooks/useAuth";
interface Props {}

const index: NextPage<Props> = (props) => {
  const {isAuthenticated, logout} = useAuth()
  return (
    <Layout>
      <Segment padded basic>
        <Grid centered>
          <Grid.Column mobile={16} tablet={8} computer={12} floated="left">
            <p className="ui text">Let's get you started</p>
          </Grid.Column>
          {!isAuthenticated && (
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
          )}

          {isAuthenticated && (
            <Button fluid secondary onClick={logout}>Logout</Button>
          )}
        </Grid>
      </Segment>
    </Layout>
  );
};

export default index;
