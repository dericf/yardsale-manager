import React, { Fragment, useState, useContext } from "react";
import {
  Menu,
  Icon,
  Portal,
  Segment,
  Button,
  Header,
  Popup
} from "semantic-ui-react";
import { withRouter, Link } from "react-router-dom";
import { AppContext, AuthContext } from "../App";
import { GET_USER } from "../graphql/queries";
import { useQuery } from "@apollo/react-hooks";

const SettingsPortal = ({ mobile = false, ...props }) => {
  const [settingsPortalOpen, setSettingsPortalOpen] = useState(false);
  const { auth, setAuth } = React.useContext(AuthContext);
  const { app, setApp } = useContext(AppContext);

  const openLoginModal = () => {
    setSettingsPortalOpen(false);
    setApp({ ...app, showLoginModal: true });
    console.log("Opened the modal");
  };

  const { loading: userLoading, error: userError, data: userData } = useQuery(
    GET_USER,
    {
      onError: e => console.log("ERROR WITH Get User QUERY", e),
      onCompleted: data => {
        if (data) {
          setAuth({ ...auth, user: data.user[0] });
        }
      }
    }
  );

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
        <Segment id="SettingsPortal" loading={userLoading} raised>
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
                  fluid
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
              fluid
              className="save"
              icon="power off"
              content="Log In"
              onClick={openLoginModal}
            />
          )}
        </Segment>
      </Portal>
    </Fragment>
  );
};

export default withRouter(SettingsPortal);
