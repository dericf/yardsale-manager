import React, { Component, useEffect } from "react";

import { NAVBAR_HEIGHT, FOOTER_HEIGHT } from "../../constants";

import {
  Container,
  Divider,
  Button,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment,
  Card,
  Icon
} from "semantic-ui-react";
import { AppContext } from "../../App";
import { withRouter } from "react-router-dom";
import SettingsPortal from "../SettingsPortal";

const BottomNavBar = ({ history, ...props }) => {
  const { app, setApp } = React.useContext(AppContext);
  useEffect(() => {
    let pathname = "";
    try {
      pathname = window.location.pathname;
    } catch {
      pathname = props.match.path;
    }
    console.log("Pathname at Sidebar Mount is: ", pathname, props.history);
    let path = pathname === "/" ? "home" : pathname.substr(1);
    // setApp({ ...app, activePage: path });

    console.log("APP CONTEXT SIDEBAR MOUNT: ", app);
  }, []);

  const setActivePage = page => {
    setApp({ ...app, activePage: page });
  };

  return (
    <Segment textAlign="center" className="primary-background py0">
      <Button.Group id="BottomNavBar">
        <Button
          icon
          className={app.activePage === "home" && "active"}
          onClick={() => {
            setActivePage("home");
            history.push("/");
          }}
        >
          <Icon name="home" fitted />
        </Button>
        <Button
        className={app.activePage === "market" && "active"}
          icon
          onClick={() => {
            setActivePage("market");
            history.push("/market");
          }}
        >
          <Icon.Group>
            <Icon name="map marker alternate" fitted />
            {/* <Icon corner name='location arrow' circular /> */}
          </Icon.Group>
        </Button>
        <Button
        className={app.activePage === "sellers" && "active"}
          icon
          onClick={() => {
            setActivePage("sellers");
            history.push("/sellers");
          }}
        >
          <Icon name="users" fitted />
        </Button>
        <Button
        className={app.activePage === "yardsales" && "active"}
          icon
          onClick={() => {
            setActivePage("yardsales");
            history.push("/yardsales");
          }}
        >
          <Icon name="tags" fitted />
        </Button>
      </Button.Group>
      <SettingsPortal mobile={true} />
    </Segment>
  );
};

export default withRouter(BottomNavBar);
