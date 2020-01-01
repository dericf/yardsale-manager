import React, { Component, Fragment, useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";

import {
  Icon,
  Menu,
  ItemGroup,
  Modal,
  Responsive,
  Sidebar,
  Container,
  Image,
  Segment,
  Header,
  Divider
} from "semantic-ui-react";

import { NAVBAR_HEIGHT } from "../../constants";

import LoginModal from "../../components/modals/LoginModal/LoginModal";
import { AuthContext } from "../../App";

// import auth  from '../../Auth'
// import { useAuth0 } from "../../react-auth0-spa";

// import { render } from "react-dom";
// import _ from "lodash";

// Apollo/GQL
// import { GET_USER } from '../../gql/queries'
// import { CREATE_USER } from '../../gql/mutations'
// import { useQuery, useMutation } from '@apollo/react-hooks';

import SettingsModal from "../modals/SettingsModal/SettingsModal";

import { notify } from "react-notify-toast";

import SidebarNav from "./SidebarNav";

import { GET_USER } from "../../graphql/queries";
import { useQuery } from "@apollo/react-hooks";

const LeftMenu = ({
  user,
  isAuthenticated,
  activeItem,
  setActiveItem,
  userQuery
}) => {
  const { auth, setAuth } = React.useContext(AuthContext);

  if (auth.isAuthenticated === false) {
    return (
      <Fragment></Fragment>
    );
  }

  return (
    <Fragment>
      {auth.isAuthenticated && (
        <Fragment>
          <Responsive as={Fragment} minWidth={350}>
              {/* Empty */}
          </Responsive>

          <Responsive as={Fragment} minWidth={560}>
            <Menu.Item
              key="home"
              as={Link}
              to="/"
              active={activeItem === "home"}
              onClick={() => setActiveItem("home")}
              index="home"
              content="Market"
              className="horizontal topNavItem"
            />

            <Menu.Item
              to="yardsales"
              index="yardsales"
              as={Link}
              active={activeItem === "yardsales"}
              onClick={() => setActiveItem("yardsales")}
              content="My Yardsales"
              className="horizontal topNavItem"
            />
          </Responsive>

          <Responsive as={Fragment} minWidth={680}>
            <Menu.Item
              to="sellers"
              index="sellers"
              as={Link}
              active={activeItem === "sellers"}
              onClick={() => setActiveItem("sellers")}
              content="My Sellers"
              className="horizontal topNavItem"
            />

            {/* <SettingsModal></SettingsModal> */}
          </Responsive>
        </Fragment>
      )}
    </Fragment>
  );
};

const RightMenu = ({
  user,
  isAuthenticated,
  activeItem,
  setActiveItem,
  userQuery
}) => {
  const [sidebarVisible, setSidebarVisible] = React.useState(false);
  const { auth, setAuth } = React.useContext(AuthContext);

  return (
    <Fragment>
      {/* Desktop */}
      <Responsive as={Fragment} minWidth={768}>
        {!auth.isAuthenticated && (
          <Menu.Item
            position="right"
            key="login"
            index={100}
            className="horizontal"
          >
            <LoginModal />
          </Menu.Item>
        )}

        {auth.isAuthenticated && (
          <Menu.Item
            position="right"
            as={Link}
            onClick={() => auth.logout(auth, setAuth)}
            content="Logout"
            icon="power off"
            key="logout"
            index={101}
            className="horizontal"
          ></Menu.Item>
        )}
      </Responsive>

      {/* Mobile */}
      <Responsive as={Fragment} maxWidth={768}>
        <Menu.Item
          as="a"
          key="mobile-toggle"
          index="mobile-toggle"
          onClick={() => setSidebarVisible(!sidebarVisible)}
          className="horizontal"
          position="right"
        >
          <Icon name="bars"></Icon>
        </Menu.Item>
        <SidebarNav
          visible={sidebarVisible}
          setVisible={setSidebarVisible}
          userQuery={userQuery}
        ></SidebarNav>
      </Responsive>
    </Fragment>
  );
};

const TopNav = props => {
  // const { loading: auth0Loading, user: auth0User } = useAuth0();
  let { auth, setAuth } = React.useContext(AuthContext);

  let pathname = "";
  try {
    pathname = window.location.pathname;
  } catch {
    pathname = props.match.path;
  }
  console.log("\n\n\nPathname: ", pathname, props.history);
  let path = pathname === "/" ? "home" : pathname.substr(1);

  const [activeItem, setActiveItem] = useState(path);

  // const [createNewUser] = useMutation(CREATE_USER);

  return (
    <Menu
      id="TopNav"
      fluid
      compact
      className={`fixed top ${activeItem}-title`}
      activeIndex={activeItem}
      style={{ height: NAVBAR_HEIGHT }}
    >
      {/* Logo */}
      <Menu.Header
        as="h2"
        className="mb0"
        content="Yardsale Manager"
        style={{ paddingTop: 12, marginRight: "16px" }}
      />

      {/* Left Side of Navigation */}
      <LeftMenu activeItem={activeItem} setActiveItem={setActiveItem} />

      {/* Right Side of Navigation */}
      <RightMenu activeItem={activeItem} setActiveItem={setActiveItem} />
    </Menu>
  );
};

export default withRouter(TopNav);
