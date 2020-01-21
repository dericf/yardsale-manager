import React, { Component, Fragment, useState, useEffect, useRef } from "react";
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
  Table,
  Popup,
  Label,
  Container
} from "semantic-ui-react";

import { notify } from "react-notify-toast";

import { useQuery } from "@apollo/react-hooks";
import { UPDATE_SELLER, CREATE_SELLER } from "../../../graphql/mutations";
import {
  GET_TRANSACTION_ITEMS_FOR_YARDSALE,
  GET_SELLER_LINKS_FOR_YARDSALE
} from "../../../graphql/queries";

import { toMoney, fromMoney } from "../../../utils/formating";

const YardsaleTransactionsModal = ({
  yardsale,
  iconLabel,
  mobile,
  desktop,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  const { loading, error, data } = useQuery(
    GET_TRANSACTION_ITEMS_FOR_YARDSALE,
    {
      variables: {
        yardsaleUUID: yardsale.uuid
      },
      onError: () => console.log("ERROR WITH QUERY"),

      onCompleted: data => {
        if (data == null || typeof data == "undefined") {
          return false;
        }
        return true;
      }
    }
  );

  const { loading: sellerLinksLoading, data: sellerLinksData } = useQuery(
    GET_SELLER_LINKS_FOR_YARDSALE,
    {
      variables: {
        yardsaleUUID: yardsale.uuid
      },
      onError: () => console.log("ERROR WITH QUERY"),

      onCompleted: data => {
        if (data == null || typeof data == "undefined") {
          return false;
        }
        return true;
      }
    }
  );

  const cancel = () => {
    closeModal();
  };

  const save = () => {};

  const closeModal = () => {
    setOpen(false);
  };

  const openModal = () => {
    setOpen(true);
  };

  return (
    <Fragment>
      <Popup
        inverted
        content="View Transactions"
        position="top center"
        trigger={
          <Button
            onClick={openModal}
            icon="dollar"
            content={iconLabel}
            basic
            circular
            tabIndex="-1"
            className="icon"
          ></Button>
        }
      />

      <Modal
        open={open}
        closeIcon={<Icon name="close" onClick={closeModal}></Icon>}
        closeOnDimmerClick={true}
        closeOnEscape={true}
        dimmer={false}
        style={{ height: "90vh", width: 500 }}
      >
        <Modal.Header>{`Transactions for ${yardsale.name}`}</Modal.Header>
        <Modal.Content style={{ maxHeight: "78vh", overflowY: "auto" }}>
          <Divider horizontal content="Seller Summary" className="mt0" />
          {!sellerLinksLoading &&
            sellerLinksData &&
            sellerLinksData.yardsale_seller_link && (
              <Fragment>
                <Table
                  style={{
                    maxWidth: 275,
                    marginLeft: "auto",
                    marginRight: "auto"
                  }}
                  className="mt0"
                  striped
                  compact
                  basic="very"
                  unstackable
                >
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell textAlign="left">
                        Seller
                      </Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">
                        Total Sales
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    <Fragment>
                      {sellerLinksData.yardsale_seller_link.map(link => {
                        return (
                          <Table.Row key={link.uuid}>
                            <Table.Cell textAlign="left">
                              {link.seller.name} ({link.seller.initials}){" "}
                              {link.seller.is_deleted === true && (
                                <strong> - *Seller Removed*</strong>
                              )}
                            </Table.Cell>
                            <Table.Cell textAlign="right">
                              ${" "}
                              {toMoney(
                                link.seller.transactions.reduce(
                                  (accum, currentItem) =>
                                    Number(accum) +
                                    Number(fromMoney(currentItem.price)),
                                  0
                                )
                              )}
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}

                      {!sellerLinksData.yardsale_seller_link && (
                        <Table.Row>
                          <Table.Cell textAlign="left" colSpan={2}>
                            No transactions
                          </Table.Cell>
                        </Table.Row>
                      )}
                    </Fragment>
                  </Table.Body>
                </Table>
                {!loading &&
                  data &&
                  data.transaction &&
                  data.transaction.length > 0 && (
                    <Container textAlign="center">
                      <Label
                        style={{ width: 275 }}
                        size="large"
                        color="white"
                        content={`Grand Total: $ ${toMoney(
                          data.transaction.reduce(
                            (accum, currentItem) =>
                              Number(accum) +
                              Number(fromMoney(currentItem.price)),
                            0
                          )
                        )}`}
                      />

                      {data.transaction.length == 0 && (
                        <Label size="large" content={`Grand Total: $ 0.00`} />
                      )}
                    </Container>
                  )}
              </Fragment>
            )}

          <Divider></Divider>
          <Divider horizontal content="All Transaction Items" />

          {!loading && data && data.transaction && (
            <Fragment>
              <Table
                className="mt0"
                striped
                compact
                basic="very"
                unstackable
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  maxWidth: "600px   "
                }}
              >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell textAlign="left" style={{ width: 200 }}>
                      Seller
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign="left">
                      Description
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign="center" style={{ width: 140 }}>
                      Price
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  <Fragment>
                    {/* <Highlight >
                                                {JSON.stringify(invoice, null, 2)}
                                            </Highlight> */}

                    {data.transaction.length === 0 && (
                      <Table.Row textAlign="center">
                        <Table.Cell textAlign="center" colSpan="5">
                          No Transactions for this Yardsale
                        </Table.Cell>
                      </Table.Row>
                    )}

                    {data.transaction.map(item => {
                      return (
                        <Table.Row key={item.uuid}>
                          <Table.Cell textAlign="left">
                            {item.seller.name} ({item.seller.initials}){" "}
                            {item.seller.is_deleted === true && (
                              <strong> - *Seller Removed*</strong>
                            )}
                          </Table.Cell>
                          <Table.Cell textAlign="left">
                            {item.description}
                          </Table.Cell>
                          <Table.Cell textAlign="right">
                            $ {toMoney(item.price)}
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Fragment>
                </Table.Body>
              </Table>
            </Fragment>
          )}
          <Divider></Divider>
        </Modal.Content>

        {/* <Modal.Actions>
          <Grid centered>
            <Grid.Row columns={1} textAlign="center">
              <Grid.Column width={6} textAlign="center">
                <Button fluid onClick={closeModal} negative>
                  Close
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Actions> */}
      </Modal>
    </Fragment>
  );
};

export default withRouter(YardsaleTransactionsModal);
