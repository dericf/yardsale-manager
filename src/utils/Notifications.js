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
  Popup,
  Transition
} from "semantic-ui-react";

import Loading from "../components/layout/Loading";
import LoadImage from "../assets/logo2.jpg";
import { AppContext } from "../App";

const Notifications = () => {
  const { app, setApp } = useContext(AppContext);
  const { show, message, level, dismiss } = app.notifications;

  const setShow = newVal => {
    setApp({ ...app, notifications: { ...app.notifications, show: newVal } });
  };
  useEffect(() => {
    const notifications = document.getElementById("TopNotificationBar");
    if (notifications && show === true) {
      
      // setApp({...app, notifications: null})
      if (dismiss === true) {
        setTimeout(() => {
          setShow(false)
        }, 3000);
      }
    } else {
      setShow(false);
    }
    console.log("Top Notifications");
  }, [show]);

  if (!show || show === false) {
    return <Fragment />;
  }

  return (
    <Transition visible={show} animation="slide left" duration={750} transitionOnMount={true} >
      <div className="grid-notifications" id="TopNotificationBar" >
        <Segment
          fluid
          
          textAlign="center"
          raised
          style={{
            padding: 0,
            borderRadius: 0,
            border: "none"
          }}
        >
          <Message
            id="NotificationMessage"
            className={ [level === 'success' && "success", level === 'info' && "info", level === 'error' && 'error']}
            size="large"
            fluid
            style={{
              border: "0px",
              borderRadius: 0,
              paddingTop: 2,
              paddingBottom: 2
            }}
          >
            <Message.Content>
              {message}
              &nbsp;
              <Icon
                name="close"
                size="small"
                onClick={() => setShow(false)}
                style={{ top: "calc(50% - 10px)" }}
              ></Icon>
            </Message.Content>
          </Message>
        </Segment>
      </div>
    </Transition>
  );
};

export default withRouter(Notifications);
