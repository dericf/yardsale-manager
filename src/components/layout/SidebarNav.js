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
    <div className="grid-sidebar-subgrid" >
      <div className="grid-sidebar-settings">
        <Menu id="SettingsSidebar" borderless compact icon vertical>
          <SettingsPortal />
        </Menu>
      </div>

      <div className="grid-sidebar-middle">
        <Button.Group vertical id="LeftNavBar">
          <Button
            icon
            textAlign="center"
            className={app.activePage === "home" && "active"}
            onClick={() => {
              setActivePage("home");
              history.push("/");
            }}
          >
            <Icon name="home" fitted />
          </Button>
          <Button
            icon
            className={app.activePage === "market" && "active"}
            onClick={() => {
              setActivePage("market");
              history.push("/market");
            }}
          >
            <Icon name="map marker alternate" fitted />
          </Button>
          <Button
            icon
            className={app.activePage === "sellers" && "active"}
            onClick={() => {
              setActivePage("sellers");
              history.push("/sellers");
            }}
          >
            <Icon name="users" fitted />
          </Button>
          <Button
            icon
            className={app.activePage === "yardsales" && "active"}
            onClick={() => {
              setActivePage("yardsales");
              history.push("/yardsales");
            }}
          >
            <Icon name="tags" fitted />
          </Button>
        </Button.Group>
      </div>
    </div>
  );
};

export default withRouter(SidebarNav);
