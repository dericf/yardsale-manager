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

const SettingsPortal = () => {
  const [settingsPortalOpen, setSettingsPortalOpen] = useState(false);
  const { auth, setAuth } = React.useContext(AuthContext);
  const { app, setApp } = useContext(AppContext);

  const openLoginModal = () => {
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
    <Menu.Item>
      <Icon
        circular
        name="setting"
        className="sidebar-item"
        onClick={() => setSettingsPortalOpen(true)}
      ></Icon>
      {/* TODO: Move this to a component */}
      <Portal
        onClose={() => setSettingsPortalOpen(false)}
        open={settingsPortalOpen}
      >
        <Segment id="SettingsPortal" loading={userLoading}>
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
                  onClick={() => setAuth(auth.logout(auth, setAuth))}
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
    </Menu.Item>
  );
};

export default withRouter(SettingsPortal);
