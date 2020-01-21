import React, { useState, useEffect, Fragment } from "react";
import { withRouter, Link } from "react-router-dom";
import {
  Menu,
  Icon,
  Portal,
  Segment,
  Button,
  Header,
  Popup
} from "semantic-ui-react";
import App, { AuthContext, AppContext } from "../../App";

import { useQuery } from "@apollo/react-hooks";
import { GET_USER } from "../../graphql/queries";

const SidebarNav = ({ ...props }) => {
  const history = props.history;
  const { auth, setAuth } = React.useContext(AuthContext);
  const { app, setApp } = React.useContext(AppContext);
  const [settingsPortalOpen, setSettingsPortalOpen] = useState(false);

  useEffect(() => {
    let pathname = "";
    try {
      pathname = window.location.pathname;
    } catch {
      pathname = props.match.path;
    }
    console.log("Pathname at Sidebar Mount is: ", pathname, props.history);
    let path = pathname === "/" ? "home" : pathname.substr(1);
    setApp({ ...app, activePage: path });

    console.log('APP CONTEXT SIDEBAR MOUNT: ', app)
  }, []);

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
  const setActivePage = page => {
    setApp({ ...app, activePage: page });
  };

  const openLoginModal = () => {
    setApp({ ...app, showLoginModal: true });
    console.log("Opened the modal");
  };
  return (
    <div className="layout-sidebar">
      <Menu
        borderless
        stackable
        id="SidebarMiddle"
        compact
        icon
        vertical
      >
      <Menu.Item>
          <Icon
            basic
            circular
            name="setting"
            size="large"
            className="sidebar-item"
            onClick={() => setSettingsPortalOpen(true)}
          ></Icon>
          {/* TODO: Move this to a component */}
          <Portal
            onClose={() => setSettingsPortalOpen(false)}
            open={settingsPortalOpen}
          >
            <Segment
              raised
              style={{
                left: "65px",
                position: "fixed",
                top: "10px",
                zIndex: 1000,
                borderLeft: "3px solid rgba(50, 67, 118, 0.513)",
                borderRadius: 8
              }}
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
                  basic
                  circular
                  fluid
                  icon="power off"
                  content="Log In"
                  onClick={openLoginModal}
                />
              )}
            </Segment>
          </Portal>
        </Menu.Item>
        <Menu.Item active={app.activePage === "home"}  name="home">
          <Icon
            circular
            
            name="home"
            active={app.activePage === "home"}
            onClick={() => {
              setActivePage("home");
              history.push("/");
            }}
            className="sidebar-item"
          />
        </Menu.Item>

        <Menu.Item
          
          name="market"
          active={app.activePage === "market"}
        >
          <Icon
            circular
            
            name="location arrow"
            className="sidebar-item"
            active={app.activePage === "market"}
            onClick={() => {
              setActivePage("market");
              history.push("/market");
            }}
          />
        </Menu.Item>

        <Menu.Item
          
          name="sellers"
          active={app.activePage === "sellers"}
        >
          <Icon
            circular
            
            name="users"
            onClick={() => {
              setActivePage("sellers");
              history.push("/sellers");
            }}
            active={app.activePage === "sellers"}
            className="sidebar-item"
          />
        </Menu.Item>

        <Menu.Item
          
          name="yardsales"
          active={app.activePage === "yardsales"}
        >
          <Icon
            circular
            
            name="map signs"
            active={app.activePage === "yardsales"}
            onClick={() => {
              setActivePage("yardsales");
              history.push("/yardsales");
            }}
            className="sidebar-item"
          />

          {/* <Icon
            circular
            
            name="tags"
            active={app.activePage === "items"}
            onClick={() => {
              setActivePage("items");
              history.push("/items");
            }}
            className="sidebar-item"
          /> */}
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default withRouter(SidebarNav);
