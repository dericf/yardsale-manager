import React from "react";
import loading from "../../assets/loading.svg";
import { Segment, Loader, Dimmer } from "semantic-ui-react";

const Loading = () => (

  <Segment loading  content="Loading" 
    style={{
        height: "100vh", 
        width: "100vw",
        position: "fixed"
      }}
    >
  </Segment>
);

export default Loading;