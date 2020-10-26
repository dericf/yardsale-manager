import React, { Component, Fragment, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  Header,
  Icon,
  Menu,
  Responsive,
  Button,
  Grid,
  ButtonGroup,
  Popup,
  Segment
} from "semantic-ui-react";

import YardsaleDetailsModal from "../modals/YardsaleDetailsModal/YardsaleDetailsModal";
import YardsaleTransactionsModal from "../modals/YardsaleTransactionsModal/YardsaleTransactionsModal";
import YardsaleSellerModal from "../modals/YardsaleSellerModal/YardsaleSellerModal";
import CashierModal from "../modals/CashierModal/CashierModal";
import ConfirmModal from "../modals/generic/ConfirmModal";

import { notify } from "react-notify-toast";
import { DELETE_YARDSALE } from "../../graphql/mutations";
import { GET_YARDSALES } from "../../graphql/queries";
import { useMutation } from "@apollo/react-hooks";

const DesktopActionGroup = ({
  yardsale,
  setCashierActive,
  mobile = false,
  desktop = true
}) => {
  // state for mobile hover menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(true);
  //
  const mobileStyles = {
    paddingLeft: 0,
    paddingRight: 0
  };
  return (
    <Segment
      compact
      fluid
      textAlign="center"
      className="mx-auto rounded"
      style={{ border: 0 }}
    >
      <Grid centered padded stackable columns="equal">
        <Grid.Row centered className="py0">
          <Grid.Column
            textAlign="center"
            style={{ paddingTop: 0, paddingBottom: 0 }}
          >
            <YardsaleDetailsModal edit={true} yardsale={yardsale} />
          </Grid.Column>

          <Grid.Column
            textAlign="center"
            style={{ paddingTop: 0, paddingBottom: 0 }}
          >
            <YardsaleSellerModal yardsale={yardsale} />
          </Grid.Column>

          <Grid.Column
            textAlign="center"
            style={{ paddingTop: 0, paddingBottom: 0 }}
          >
            <YardsaleTransactionsModal
              yardsale={yardsale}
              iconLabel={false && "History"}
            />
          </Grid.Column>
          <Grid.Column
            textAlign="center"
            style={{ paddingTop: 0, paddingBottom: 0 }}
          >
            <ConfirmModal
              circular={true}
              buttonProps={{
                icon: "trash",
                content: false && "Remove",
                circular: true,
                className: "list-action-icon"
              }}
              handleConfirm={() => {
                confirmDeactivateYardsale();
              }}
              handleCancel={() => console.log("cancel")}
              header="Confirm Delete"
              content={`Proceed deleting ${yardsale.name}?`}
              warningMessage={"Warning! This action cannot be undone!"}
              popupEnabled={true}
              popupMessage={"Remove Yard Sale"}
              popupPosition={"top center"}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

const YardsaleActions = ({ yardsale, setCashierActive }) => {
  const [
    deleteYardsaleMutation,
    { loading: deleteYardsaleLoading, error: deleteYardsaleError }
  ] = useMutation(DELETE_YARDSALE, {});

  const confirmDeactivateYardsale = () => {
    console.log("Deleting Yardsale!!!");
    deleteYardsaleMutation({
      variables: {
        yardsaleUUID: yardsale.uuid
      },
      refetchQueries: [
        {
          query: GET_YARDSALES
        }
      ]
    });
  };

  const cashierMode = () => {};
  const props = {
    yardsale,
    setCashierActive,
    confirmDeactivateYardsale
  };
  return (
    <Fragment>
      <Grid>
        <Grid.Column width={16}>
          <DesktopActionGroup {...props} />

          {/* <Responsive minWidth={650}>
            <DesktopActionGroup {...props} desktop={true} mobile={null} />
          </Responsive>

          <Responsive maxWidth={649}>
            <DesktopActionGroup {...props} mobile={true} desktop={null} />
          </Responsive> */}
        </Grid.Column>
      </Grid>
    </Fragment>
  );
};

export default withRouter(YardsaleActions);
