import React from "react";
import loading from "../../assets/loading.svg";
import { Segment, Loader, Dimmer } from "semantic-ui-react";

const Loading = () => (

  <Segment loading  content="Loading" id="LoadingSegment" className="rounded borderless">
  </Segment>
);

export default Loading;