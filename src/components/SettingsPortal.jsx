import React, { Fragment, useState, useContext } from "react";
import {
  Menu,
  Icon,
  Portal,
  Segment,
  Button,
  Header,
  Popup,
} from "semantic-ui-react";
import { withRouter, Link, useHistory } from "react-router-dom";
import { AppContext } from "../AppContext";
import { AuthContext } from "../AuthContext";
import { GET_USER } from "../graphql/queries";
import { useQuery } from "@apollo/react-hooks";

const SettingsPortal = ({ mobile = false, history, ...props }) => {
  const [settingsPortalOpen, setSettingsPortalOpen] = useState(false);
  const { auth, setAuth } = React.useContext(AuthContext);
  const { app, setApp } = useContext(AppContext);
  return (
    <Fragment>
      <Button
        icon
        className="settings-portal-button"
        onClick={() => setSettingsPortalOpen(true)}
      >
        <Icon fitted name="setting"></Icon>
      </Button>

      <Portal
        onClose={() => setSettingsPortalOpen(false)}
        open={settingsPortalOpen}
      >
        <Segment id="SettingsPortal" raised>
          <Fragment>
            {auth.user && (
              <Fragment>
                <Header>Settings</Header>
                <p className="ui text">User: {auth.user.email}</p>
                <p>
                  <Link
                    to="/request-change-password"
                    onClick={() => setSettingsPortalOpen(false)}
                  >
                    Change Password
                  </Link>
                </p>
                {!auth.user.has_completed_onboarding && (
                  <p>
                    <Link
                      to="/welcome"
                      onClick={() => setSettingsPortalOpen(false)}
                    >
                      Click here to resume the onboarding process
                    </Link>
                  </p>
                )}
                <Button
                  className="save"
                  fluid={true}
                  icon="power off"
                  content="Logout"
                  onClick={() => auth.logout(auth, setAuth, props.history)}
                />
              </Fragment>
            )}
            {/* {JSON.stringify(auth.user)} */}
          </Fragment>
          {!auth.user && (
            <Button
              fluid={true}
              className="save"
              icon="power off"
              content="Log In"
              onClick={() => history.go("/login", "Login")}
            />
          )}
        </Segment>
      </Portal>
    </Fragment>
  );
};

export default withRouter(SettingsPortal);
