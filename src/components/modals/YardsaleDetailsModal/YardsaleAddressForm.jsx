import React, {
  Component,
  Fragment,
  useState,
  useEffect,
  useRef,
  useContext
} from "react";
import { Link, withRouter } from "react-router-dom";
import {
  Card,
  Icon,
  Divider,
  Grid,
  Modal,
  Button,
  Form,
  Input,
  TextArea,
  Header,
  Checkbox,
  Message,
  Popup,
  Segment
} from "semantic-ui-react";
import { notify } from "react-notify-toast";
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_YARDSALE, CREATE_YARDSALE } from "../../../graphql/mutations";
import { GET_YARDSALES, GET_YARDSALE } from "../../../graphql/queries";

import TimePicker from "../../TimePicker";

// import YardsaleAddressMap from "./YardsaleAddressMap";
import { AppContext } from "../../../App";

const YardsaleAddressForm = ({ form, setForm, autofocus = true, ...props }) => {
  const { app, setApp } = useContext(AppContext);
  const [address, setAddress] = useState(form)
  const handleInputChange = event => {
    // TODO: Move this to a hook
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setAddress({ ...address, [name]: value });
  };

  const cancel = () => {
    // setForm({
    //   ...form,
    //   street1: "",
    //   street2: "",
    //   country: "",
    //   province: "",
    //   city: "",
    //   postal: ""
    // });
    closeModal();
  };

  return (
    <Fragment>
      <Form as={Grid} className="p0 m0">
        
      </Form>
    </Fragment>
  );
};

export default withRouter(YardsaleAddressForm);
