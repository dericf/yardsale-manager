import React, { Component, Fragment, useContext } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  Header,
  Icon,
  Menu,
  Responsive,
  Button,
  Grid,
  Segment
} from "semantic-ui-react";

import SellerDetailsModal from "../modals/SellerDetailsModal/SellerDetailsModal";
import SellerTransactionsModal from "../modals/SellerTransactionsModal/SellerTransactionsModal";
import ConfirmModal from "../modals/generic/ConfirmModal";

import { AppContext } from "../../App";

// Apollo/GQL
// import { useMutation, useQuery } from '@apollo/react-hooks';

import { GET_SELLERS } from "../../graphql/queries";
import { DELETE_SELLER } from "../../graphql/mutations";
import { useMutation } from "@apollo/react-hooks";

const SellerActions = ({ seller }) => {
  const { app, setApp } = useContext(AppContext);
  const [
    deleteSellerMutation,
    { loading: deleteSellerLoading, error: deleteSellerError }
  ] = useMutation(DELETE_SELLER);

  const confirmDeactivateSeller = () => {
      console.log('Deleting seller')
    setApp({
      ...app,
      notifications: {
        show: true,
        dismiss: true,
        message: "Seller Deleted Successfully",
        level: "info"
      }
    });
    deleteSellerMutation({
      variables: {
        sellerUUID: seller.uuid
      },
      refetchQueries: [
        {
          query: GET_SELLERS
        }
      ]
    });
  };
  return (
    <Fragment>
      {/* // Desktop Items */}
      <Segment
        compact
        fluid
        textAlign="center"
        className="mx-auto rounded"
        style={{ border: 0 }}
      >
        <Grid centered stackable padded="horizontally" columns="equal" >
          <Grid.Row centered className="py16 px16">
            <Grid.Column textAlign="center" className="py0">
              <SellerDetailsModal
                edit={true}
                seller={seller}
              ></SellerDetailsModal>
            </Grid.Column>
            <Grid.Column textAlign="center" className="py0">
              {/* <Button color="green" fluid ><Icon name="dollar"></Icon> Transaction History</Button> */}
              <SellerTransactionsModal seller={seller} />
            </Grid.Column>

            <Grid.Column textAlign="center" className="py0" >
              <ConfirmModal
              circular={true}
                buttonProps={{
                  icon: "trash",
                  content: null
                }}
                disabled={seller.is_user_link}
                handleConfirm={() => {
                  confirmDeactivateSeller();
                }}
                handleCancel={() => console.log("cancel")}
                header="Confirm Delete"
                content={`Proceed deleting ${seller.name}?`}
                warningMessage={"Warning! This action cannot be undone!"}
                popupEnabled={true}
                popupMessage={"Remove Seller"}
                popupPosition={"top center"}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </Fragment>
  );
};

export default withRouter(SellerActions);
