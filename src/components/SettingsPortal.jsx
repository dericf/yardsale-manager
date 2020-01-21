import React, { useState, useContext } from "react";
import { Menu, Icon, Portal, Segment, Button } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import { AppContext } from "../App";

const SettingsPortal = () => {
  const [settingsPortalOpen, setSettingsPortalOpen] = useState(false);
  const { app, setApp } = useContext(AppContext)
  return (
    <Menu.Item>
      <Icon
        circular
        fitted
        name="setting"
        className="sidebar-item"
        onClick={() => setSettingsPortalOpen(true)}
      ></Icon>
      {/* TODO: Move this to a component */}
      <Portal
            onClose={() => setSettingsPortalOpen(false)}
            open={settingsPortalOpen}
          >
            <Segment
              id="SettingsPortal"
              loading={userLoading}
            >
              <Fragment>
                {auth && auth.user && (
                  <Fragment>
                    <Header>Settings</Header>
                    <p>
                      User: {auth.user.email}
                      {auth.user.has_confirmed && (
                        <Popup
                          trigger={
                            <Icon name="check" color="green" size="small" />
                          }
                          content={"Verified Email"}
                        />
                      )}
                    </p>
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
                      basic
                      circular
                      fluid
                      icon="power off"
                      content="Logout"
                      onClick={() => setAuth(auth.logout(auth, setAuth))}
                    />
                  </Fragment>
                )}
                {/* {JSON.stringify(auth.user)} */}
              </Fragment>
              {auth && !auth.user && (
                <Button
                  fluid
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


export default withRouter(SettingsPortal)