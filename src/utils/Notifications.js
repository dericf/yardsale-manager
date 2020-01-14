import React, { Fragment, useEffect, useState, useContext } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  Segment,
  Grid,
  Divider,
  Loader,
  Dimmer,
  Container,
  Message,
  Header,
  Image,
  Icon,
  IconGroup,
  Popup
} from "semantic-ui-react";

import Loading from "../components/layout/Loading";
import LoadImage from "../assets/logo2.jpg";
import { AppContext } from "../App";

const Notifications = () => {
  const { app, setApp } = useContext(AppContext);
  const { show, message, level, dismiss } = app.notifications;

  const setShow = () => {
    setApp({ ...app, notifications: { ...app.notifications, show: false } });
  };
  useEffect(() => {
    const notifications = document.getElementById("TopNotificationBar");
    if (notifications && show) {
      notifications.style.display = "grid";
      if (dismiss === true) {
        setTimeout(() => {
          notifications.style.display = "none";
        }, 3000);
      }
    } else {
      notifications.style.display = "none";
      setShow(false);
    }
  }, [app]);

  return (
    <Segment
      fluid
      textAlign="center"
      raised
      style={{ height: "100%", padding: 0, borderRadius: 0, border: "none" }}
    >
      <Message
        success={level === "success"}
        id="NotificationMessage"
        size="large"
        fluid
        color={
          app.notifications.level === "error"
            ? "red"
            : app.notifications.level === "success"
            ? "green"
            : app.notifications.level === "info"
            ? "blue"
            : null
        }
        style={{
          height: "95%",
          border: "0px",
          borderRadius: 0,
          paddingTop: 2,
          paddingBottom: 2
        }}
      >
        <Message.Content>
          {message}
          &nbsp;
          <Popup
            position="top left"
            inverted
            trigger={
              <Icon
                name="close"
                size="small"
                onClick={() => setShow(false)}
                style={{ top: "calc(50% - 10px)" }}
              ></Icon>
            }
            content="Dissmiss Notification"
          ></Popup>
        </Message.Content>
      </Message>
    </Segment>
  );
};

export default withRouter(Notifications);
