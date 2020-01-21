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
import SettingsPortal from "../SettingsPortal";

const SidebarNav = ({ ...props }) => {
  const history = props.history;
  const { app, setApp } = React.useContext(AppContext);
  const { auth, setAuth } = React.useContext(AuthContext);


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

    console.log("APP CONTEXT SIDEBAR MOUNT: ", app);
  }, []);

  const setActivePage = page => {
    setApp({ ...app, activePage: page });
  };

  return (
    <div className="grid-sidebar-subgrid">
      <div className="grid-sidebar-settings">
        <Menu id="SettingsSidebar" borderless compact icon vertical>
          <SettingsPortal />
        </Menu>
      </div>

      <div className="grid-sidebar-middle">
        <Menu borderless stackable id="SidebarMiddle" compact icon vertical>
          <Menu.Item active={app.activePage === "home"} name="home">
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

          <Menu.Item name="market" active={app.activePage === "market"}>
            <Icon
              circular
              name="map marker alternate"
              className="sidebar-item"
              active={app.activePage === "market"}
              onClick={() => {
                setActivePage("market");
                history.push("/market");
              }}
            />
          </Menu.Item>

          {auth && auth.user && (
            <Fragment>
              <Menu.Item name="sellers" active={app.activePage === "sellers"}>
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
              </Menu.Item>
            </Fragment>
          )}
        </Menu>
      </div>
    </div>
  );
};

export default withRouter(SidebarNav);
