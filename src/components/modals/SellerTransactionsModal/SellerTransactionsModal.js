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
  Container,
  Label,
  Segment
} from "semantic-ui-react";

import { notify } from "react-notify-toast";

import { useQuery } from "@apollo/react-hooks";
import { UPDATE_SELLER, CREATE_SELLER } from "../../../graphql/mutations";
import {
  GET_TRANSACTION_ITEMS_FOR_SELLER,
  GET_SELLER_LINKS_FOR_SELLER
} from "../../../graphql/queries";

import { toMoney, fromMoney } from "../../../utils/formating";

const SellerTransactionsModal = ({ seller, iconLabel, ...props }) => {
  const [open, setOpen] = useState(false);

  const { loading, error, data } = useQuery(GET_TRANSACTION_ITEMS_FOR_SELLER, {
    variables: {
      sellerUUID: seller.uuid
    },
    onError: () => console.log("ERROR WITH QUERY")
  });

  const { loading: sellerLinksLoading, data: sellerLinksData } = useQuery(
    GET_SELLER_LINKS_FOR_SELLER,
    {
      variables: {
        sellerUUID: seller.uuid
      },
      onError: () => console.log("ERROR WITH QUERY")
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
      <Button
        circular
        basic
        onClick={openModal}
        icon={<Icon name="dollar" fitted></Icon>}
        content={iconLabel && iconLabel}
      ></Button>

      <Modal
        open={open}
        closeIcon={<Icon name="close" onClick={closeModal}></Icon>}
        onClose={closeModal}
        closeOnDimmerClick={true}
        closeOnEscape={true}
        dimmer="blurring"
      >
        <Modal.Header>{`Transactions for ${seller.name}`}</Modal.Header>
        <Modal.Content scrolling>
          <Divider horizontal content="Yardsale Summary" />
          {!sellerLinksLoading &&
            sellerLinksData &&
            sellerLinksData.yardsale_seller_link && (
              <Grid centered>
                <Grid.Column mobile={16} computer={8}>
                  <Segment textAlign="center" raised className="p0 rounded">
                    <Table
                      className="mt0"
                      striped
                      compact
                      basic="very"
                      unstackable
                    >
                      <Table.Header>
                        <Table.Row className="primary">
                          <Table.HeaderCell textAlign="left">
                            Yardsale
                          </Table.HeaderCell>
                          <Table.HeaderCell textAlign="center">
                            Total Sales
                          </Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>

                      <Table.Body>
                        <Fragment>
                          {sellerLinksData.yardsale_seller_link.map(
                            (link, index) => {
                              return (
                                <Table.Row key={index + 5000}>
                                  <Table.Cell textAlign="left">
                                    {link.yardsale.name}
                                  </Table.Cell>
                                  <Table.Cell textAlign="right">
                                    ${" "}
                                    {toMoney(
                                      link.yardsale.transactions.reduce(
                                        (accum, currentItem) =>
                                          Number(accum) +
                                          Number(fromMoney(currentItem.price)),
                                        0
                                      )
                                    )}
                                  </Table.Cell>
                                </Table.Row>
                              );
                            }
                          )}
                          {sellerLinksData.yardsale_seller_link && sellerLinksData.yardsale_seller_link.length === 0 && (
                              <Table.Row key="NoTransactionKey">
                              <Table.Cell textAlign="center" colspan="2">
                               No Transactions for {seller.name}
                              </Table.Cell>
                            </Table.Row>
                          )}
                        </Fragment>
                      </Table.Body>
                    </Table>
                  </Segment>
                  {!loading &&
                    data &&
                    data.transaction &&
                    data.transaction.length > 0 && (
                      <Container textAlign="center">
                        <Label
                          className="py8"
                          style={{ marginLeft: "auto", marginRight: "auto" }}
                          size="large"
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
                </Grid.Column>
              </Grid>
            )}

          <Divider horizontal content="All Transaction Items" />
          {!loading && data && data.transaction && (
            <Grid centered>
              <Grid.Column mobile={16} computer={10}>
                <Segment
                  className="rounded p0"
                  raised
                  style={{
                    maxWidth: "600px   "
                  }}
                >
                  <Table
                    className="mt0"
                    striped
                    compact
                    basic="very"
                    unstackable
                  >
                    <Table.Header>
                      <Table.Row className="primary">
                        <Table.HeaderCell textAlign="left">
                          Yardsale
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">
                          Price
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">
                          Description
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      <Fragment>
                        {/* <Highlight >
                                                {JSON.stringify(invoice, null, 2)}
                                            </Highlight> */}

                        {data.transaction && data.transaction.length === 0 && (
                          <Table.Row textAlign="center">
                            <Table.Cell textAlign="center" colSpan="5">
                              No Transactions for {seller.name}
                            </Table.Cell>
                          </Table.Row>
                        )}

                        {data.transaction &&
                          data.transaction.map((item, index) => {
                            return (
                              <Table.Row key={index + 10000}>
                                <Table.Cell textAlign="left">
                                  {item.yardsale.name}
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                  $ {toMoney(item.price)}
                                </Table.Cell>
                                <Table.Cell textAlign="left">
                                  {item.description}
                                </Table.Cell>
                              </Table.Row>
                            );
                          })}
                      </Fragment>
                    </Table.Body>
                  </Table>
                </Segment>
              </Grid.Column>
            </Grid>
          )}
        </Modal.Content>

        {/* <Modal.Actions>
          <Grid centered>
            <Grid.Row columns={1} textAlign="center">
              <Grid.Column width={16} textAlign="center">
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

export default withRouter(SellerTransactionsModal);
